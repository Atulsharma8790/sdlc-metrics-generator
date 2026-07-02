'use client'

import { useState } from 'react'
import type { MetricsReport } from '@/lib/types'
import { Header } from '@/components/Header'
import { InputPanel } from '@/components/InputPanel'
import { ReportPanel } from '@/components/ReportPanel'
import { PasscodeModal } from '@/components/PasscodeModal'
import { DisclaimerModal } from '@/components/DisclaimerModal'
import { useAuth } from '@/context/auth'
import { PORTFOLIO_URL } from '@/lib/config'

export default function Home() {
  const { isUnlocked, getHeaders } = useAuth()

  const [report, setReport] = useState<MetricsReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPasscode, setShowPasscode] = useState(false)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [lastContent, setLastContent] = useState('')
  const [lastContext, setLastContext] = useState('')

  async function handleGenerate(content: string, context: string) {
    if (!isUnlocked) { setShowPasscode(true); return }
    setLastContent(content)
    setLastContext(context)
    setLoading(true)
    setError(null)
    setReport(null)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getHeaders() },
        body: JSON.stringify({ content, context }),
      })
      const data = await res.json()
      if (res.status === 401) { setShowPasscode(true) }
      else if (!res.ok) { setError(data.error ?? 'Report generation failed. Please try again.') }
      else { setReport(data) }
    } catch {
      setError('Network error. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-app)' }}>
      <Header onShowPasscode={() => setShowPasscode(true)} onLock={() => { setReport(null); setError(null) }} />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {!report ? (
          <InputPanel
            onGenerate={handleGenerate}
            loading={loading}
            error={error}
            onNeedAuth={() => setShowPasscode(true)}
          />
        ) : (
          <ReportPanel
            report={report}
            onBack={() => { setReport(null); setError(null) }}
            onRegenerate={() => handleGenerate(lastContent, lastContext)}
            loading={loading}
          />
        )}
      </main>

      <footer className="border-t py-5" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'var(--text-dimmer)' }}>
            Built by{' '}
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:opacity-80 transition-opacity">
              Atul Sharma
            </a>
            {' '}· QA Automation Architect · AI-derived metrics — validate against your tooling
          </p>
          <p className="text-xs" style={{ color: 'var(--text-dimmer)' }}>
            Powered by Claude AI ·{' '}
            <button onClick={() => setShowDisclaimer(true)} className="underline hover:opacity-80 transition-opacity" style={{ color: 'var(--text-dimmer)' }}>
              Disclaimer & Privacy
            </button>
          </p>
        </div>
      </footer>

      {showPasscode && (
        <PasscodeModal
          onClose={() => setShowPasscode(false)}
          onUnlocked={() => lastContent && handleGenerate(lastContent, lastContext)}
        />
      )}
      {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}
    </div>
  )
}
