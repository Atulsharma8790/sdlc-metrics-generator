'use client'

import { ArrowLeft, RefreshCw, Loader2, Copy, Check, AlertTriangle, Lightbulb, TrendingUp, CheckCircle, XCircle, Printer } from 'lucide-react'
import { useState } from 'react'
import type { MetricsReport } from '@/lib/types'
import { MetricCard } from './MetricCard'
import { MetricsCharts } from './MetricsCharts'

const HEALTH_STYLES: Record<MetricsReport['healthSignal'], { color: string; bg: string; border: string }> = {
  Green: { color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)' },
  Amber: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)' },
  Red:   { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)' },
}

const COMPLETENESS_STYLES = {
  full:      { color: '#10B981', label: 'Full data' },
  partial:   { color: '#F59E0B', label: 'Partial data' },
  estimated: { color: '#6366F1', label: 'Estimated' },
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="flex items-center gap-1 text-xs transition-colors"
      style={{ color: copied ? '#10B981' : 'var(--text-muted)' }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied!' : 'Copy summary'}
    </button>
  )
}

interface Props {
  report: MetricsReport
  onBack: () => void
  onRegenerate: () => void
  loading: boolean
}

export function ReportPanel({ report, onBack, onRegenerate, loading }: Props) {
  const health = HEALTH_STYLES[report.healthSignal]
  const completeness = COMPLETENESS_STYLES[report.dataCompleteness]

  const summaryText = `${report.reportTitle}
${report.teamOrProject} · ${report.periodCovered}
Health: ${report.healthSignal} — ${report.healthSignalReason}

${report.executiveSummary}

Key Metrics:
• Release Quality Score: ${typeof report.releaseQualityScore.value === 'number' ? report.releaseQualityScore.value + '%' : report.releaseQualityScore.value}
• Defect Escape Rate: ${report.defectEscapeRate.value}${report.defectEscapeRate.unit ?? ''}
• Test Coverage: ${report.testCoverageScore.value}${report.testCoverageScore.unit ?? ''}
• Automation Ratio: ${report.automationRatio.value}${report.automationRatio.unit ?? ''}
• MTTR: ${report.mttr.value} ${report.mttr.unit ?? ''}
• Critical Defects: ${report.criticalDefects.value}

Recommendations:
${report.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}`

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>
          <ArrowLeft size={15} /> New report
        </button>
        <div className="flex items-center gap-3">
          <CopyButton text={summaryText} />
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <Printer size={13} /> Print
          </button>
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #10B981, #F59E0B)' }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            Regenerate
          </button>
        </div>
      </div>

      {/* Header card */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            {/* Data completeness badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-3"
              style={{ background: `${completeness.color}15`, border: `1px solid ${completeness.color}30`, color: completeness.color }}>
              {report.dataCompleteness === 'full' ? <CheckCircle size={11} /> : <AlertTriangle size={11} />}
              {completeness.label}
            </div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{report.reportTitle}</h2>
            <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
              {report.teamOrProject}
              {report.periodCovered && ` · ${report.periodCovered}`}
            </p>
            {report.dataCompletenessNote && (
              <p className="text-xs mt-1" style={{ color: 'var(--text-dimmer)' }}>ℹ {report.dataCompletenessNote}</p>
            )}
            <p className="text-sm mt-4 leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              {report.executiveSummary}
            </p>
          </div>

          {/* Health signal + quality score */}
          <div className="flex gap-4 flex-shrink-0">
            <div className="text-center rounded-2xl px-5 py-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
              <div className="text-4xl font-black" style={{ color: '#10B981' }}>
                {report.releaseQualityScore.value}
                {report.releaseQualityScore.unit === '%' && <span className="text-2xl">%</span>}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-dimmer)' }}>Quality Score</div>
            </div>
            <div className="text-center rounded-2xl px-5 py-4" style={{ background: health.bg, border: `1px solid ${health.border}` }}>
              <div className="text-xl font-bold" style={{ color: health.color }}>{report.healthSignal}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-dimmer)' }}>Health Signal</div>
              <div className="text-xs mt-2 max-w-[130px] leading-tight" style={{ color: health.color, opacity: 0.8 }}>
                {report.healthSignalReason.slice(0, 70)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core KPI grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Defect Escape Rate" metric={report.defectEscapeRate} />
        <MetricCard label="Test Coverage" metric={report.testCoverageScore} />
        <MetricCard label="Automation Ratio" metric={report.automationRatio} />
        <MetricCard label="Mean Time to Resolve" metric={report.mttr} />
        <MetricCard label="Defect Density" metric={report.defectDensity} />
        <MetricCard label="Bug Reopen Rate" metric={report.bugReopenRate} />
        <MetricCard label="Critical Defects (P1/P2)" metric={report.criticalDefects} />
      </div>

      {/* Charts */}
      <MetricsCharts
        defectsByPriority={report.defectsByPriority}
        defectsByComponent={report.defectsByComponent}
        testResultBreakdown={report.testResultBreakdown}
      />

      {/* Metric groups */}
      {report.metricGroups?.length > 0 && (
        <div className="space-y-5 mb-6">
          {report.metricGroups.map(group => (
            <div key={group.id} className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              <h4 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                {group.icon} {group.title}
              </h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.metrics.map(({ label, metric }) => (
                  <MetricCard key={label} label={label} metric={metric} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Risk, bottlenecks, recommendations */}
      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        {/* Risk areas */}
        {report.riskAreas.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-red-400" />
              <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Risk Areas</h4>
            </div>
            <ul className="space-y-2">
              {report.riskAreas.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-red-300">
                  <span className="flex-shrink-0">⚠</span> {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bottlenecks */}
        {report.bottlenecks.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.18)' }}>
            <div className="flex items-center gap-2 mb-3">
              <XCircle size={14} className="text-amber-400" />
              <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Bottlenecks</h4>
            </div>
            <ul className="space-y-2">
              {report.bottlenecks.map((b, i) => (
                <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-amber-400 flex-shrink-0">○</span> {b}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5 mb-6">
        {/* Recommendations */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={14} className="text-[#A5B4FC]" />
            <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Recommendations</h4>
          </div>
          <ol className="space-y-2">
            {report.recommendations.map((r, i) => (
              <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-bold text-[#A5B4FC] flex-shrink-0 w-4">{i + 1}.</span> {r}
              </li>
            ))}
          </ol>
        </div>

        {/* Strengths */}
        {report.strengths.length > 0 && (
          <div className="rounded-2xl p-5" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-emerald-400" />
              <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>What Went Well</h4>
            </div>
            <ul className="space-y-2">
              {report.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span className="text-emerald-400 flex-shrink-0">★</span> {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
