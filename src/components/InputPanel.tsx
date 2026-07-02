'use client'

import { useState, useRef } from 'react'
import { BarChart3, FileText, Loader2, Upload, X, ChevronRight, Sparkles } from 'lucide-react'
import type { Attachment } from '@/lib/types'
import { useAuth } from '@/context/auth'

interface Props {
  onGenerate: (content: string, context: string) => void
  loading: boolean
  error: string | null
  onNeedAuth: () => void
}

const EXAMPLE_DATA = `Sprint 23 — QA Summary Report
Period: Oct 14–28, 2024
Team: Platform QA (4 SDETs)

TEST EXECUTION
Total test cases: 847
Automated: 612 | Manual: 235
Pass: 798 | Fail: 34 | Blocked: 9 | Skipped: 6
New tests added this sprint: 28
Flaky tests resolved: 7

DEFECTS
Total bugs filed: 48
  P1 (Critical): 3
  P2 (High): 11
  P3 (Medium): 22
  P4 (Low): 12
Bugs closed: 41 | Carry-over: 7
Production bugs (escaped): 2
Avg resolution time: 1.8 days (P1: 4hrs, P2: 1.1 days)
Bug reopen rate: 3 bugs reopened (6.25%)

DEFECTS BY COMPONENT
Payment Gateway: 14
User Auth: 9
Dashboard: 8
API Layer: 7
Mobile App: 6
Others: 4

STORY POINTS
Sprint velocity: 63 points
QA sign-off completed: 58/63 points (92%)
Carry-over to next sprint: 5 points (auth epic)

NOTES
- Auth epic delayed due to design spec changes — 3 test scenarios blocked
- Performance regression found in dashboard load time (P2)
- New regression suite for payment flow added (22 new scenarios)`

const EXAMPLE_CONTEXT = 'QA Lead reviewing Sprint 23 for Platform team. Share with Engineering Manager and Product Owner.'

export function InputPanel({ onGenerate, loading, error, onNeedAuth }: Props) {
  const { isUnlocked, getHeaders } = useAuth()
  const [data, setData] = useState('')
  const [context, setContext] = useState('')
  const [attachment, setAttachment] = useState<Attachment | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [tab, setTab] = useState<'paste' | 'upload'>('paste')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!isUnlocked) { onNeedAuth(); return }
    setUploading(true)
    setUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/extract', { method: 'POST', headers: getHeaders(), body: fd })
      const d = await res.json()
      if (res.status === 401) { onNeedAuth(); return }
      if (!res.ok) { setUploadError(d.error ?? 'Failed to read file.'); return }
      setAttachment({ id: `${Date.now()}`, name: d.name, size: d.size, extractedText: d.extractedText })
    } catch {
      setUploadError('Failed to process file. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function getContent(): string {
    if (tab === 'upload' && attachment) return attachment.extractedText
    return data.trim()
  }

  function handleSubmit() {
    const content = getContent()
    if (!content || content.length < 20) return
    if (!isUnlocked) { onNeedAuth(); return }
    onGenerate(content, context)
  }

  function loadExample() {
    setTab('paste')
    setData(EXAMPLE_DATA)
    setContext(EXAMPLE_CONTEXT)
  }

  const canSubmit = !loading && !uploading && (
    (tab === 'upload' && attachment !== null) ||
    (tab === 'paste' && data.trim().length >= 20)
  )

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#6EE7B7' }}>
          <BarChart3 size={12} className="text-emerald-400" />
          AI-Powered QA & SDLC Metrics · From Raw Data to Insight
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight" style={{ color: 'var(--text-primary)' }}>
          Sprint data in.{' '}
          <span className="bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#F59E0B] bg-clip-text text-transparent">
            Metrics report out.
          </span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Paste your sprint summary, test results, defect log, or any QA data. Get a structured metrics dashboard with defect escape rate, MTTR, coverage score, release health signal, and actionable recommendations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        {([['paste', 'Paste Data', FileText], ['upload', 'Upload File', Upload]] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => { setTab(id); setUploadError('') }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: tab === id ? 'linear-gradient(135deg, #10B981, #F59E0B)' : 'transparent',
              color: tab === id ? 'white' : 'var(--text-muted)',
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        {/* Main data input */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          {tab === 'paste' ? (
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Sprint / QA Data
                </label>
                <button
                  onClick={loadExample}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                  style={{ background: 'rgba(16,185,129,0.12)', color: '#6EE7B7', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  <Sparkles size={11} /> Load Example Data
                </button>
              </div>
              <textarea
                value={data}
                onChange={e => setData(e.target.value)}
                placeholder={`Paste any QA or SDLC data here:
• Sprint summary reports
• Test execution results (pass/fail counts)
• Defect / bug logs with counts and priorities
• Test coverage numbers
• Velocity and story point data
• JIRA exports, CSV data, meeting notes
• Any combination of the above`}
                rows={16}
                className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-colors leading-relaxed font-mono"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
              />
              <p className="text-xs mt-2" style={{ color: 'var(--text-dimmer)' }}>{data.length} chars</p>
            </div>
          ) : (
            <div className="p-5">
              {attachment ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                  <FileText size={18} className="text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{attachment.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-dimmer)' }}>
                      {(attachment.size / 1024).toFixed(0)} KB · {attachment.extractedText.split(/\s+/).length} words extracted
                    </p>
                  </div>
                  <button onClick={() => setAttachment(null)} className="p-1 rounded-lg hover:text-red-400 transition-colors flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
                  onClick={() => inputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl px-4 py-16 text-center cursor-pointer transition-all hover:border-emerald-500/50"
                  style={{ borderColor: 'var(--border-mid)' }}
                >
                  <input ref={inputRef} type="file" className="hidden" accept=".pdf,.docx,.csv,.txt,.xlsx,.xls"
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  {uploading
                    ? <Loader2 size={28} className="text-emerald-400 animate-spin mx-auto mb-3" />
                    : <Upload size={28} className="mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
                  }
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    {uploading ? 'Extracting text…' : 'Drop file or click to browse'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-dimmer)' }}>PDF, Word, CSV, Excel, plain text · Max 10 MB</p>
                  {uploadError && <p className="text-xs text-red-400 mt-3">{uploadError}</p>}
                </div>
              )}
            </div>
          )}

          {/* Action bar */}
          <div className="border-t px-5 py-4 flex items-center justify-between gap-4"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}>
            {error
              ? <p className="text-sm text-red-400 flex-1">{error}</p>
              : <p className="text-xs flex-1" style={{ color: 'var(--text-dimmer)' }}>
                  {canSubmit ? 'Ready — report generation takes ~15–20 seconds' : 'Paste sprint data or upload a file to get started'}
                </p>
            }
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: canSubmit ? 'linear-gradient(135deg, #10B981, #F59E0B)' : 'var(--bg-chip)',
                boxShadow: canSubmit ? '0 0 28px rgba(16,185,129,0.35)' : 'none',
              }}
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Generating…</>
                : <><BarChart3 size={15} /> Generate Report <ChevronRight size={15} /></>
              }
            </button>
          </div>
        </div>

        {/* Context sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <label className="text-sm font-semibold block mb-1" style={{ color: 'var(--text-primary)' }}>
              Context <span className="font-normal text-xs" style={{ color: 'var(--text-dimmer)' }}>(optional)</span>
            </label>
            <p className="text-xs mb-3" style={{ color: 'var(--text-dimmer)' }}>
              Tell the AI who you are, what team/project this covers, or what you want to focus on.
            </p>
            <textarea
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g. QA Lead reviewing Sprint 23 for the Platform team. Audience: Engineering Manager and Product Owner."
              rows={5}
              className="w-full rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* What it generates */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-dimmer)' }}>What you&apos;ll get</p>
            <ul className="space-y-2">
              {[
                'Release Quality Score (0–100)',
                'Defect Escape Rate',
                'Test Coverage & Automation Ratio',
                'MTTR & Defect Density',
                'Defect breakdown charts',
                'Risk areas & bottlenecks',
                '3–5 actionable recommendations',
                'Executive summary (copy-ready)',
              ].map(item => (
                <li key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="text-emerald-400 flex-shrink-0">✓</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
