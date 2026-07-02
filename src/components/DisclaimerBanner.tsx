'use client'

import { useState, useEffect } from 'react'
import { X, ShieldCheck } from 'lucide-react'

const SESSION_KEY = 'metrics_tool_disclaimer_dismissed'

export function DisclaimerBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem(SESSION_KEY)) setVisible(true)
  }, [])

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="w-full px-4 py-2.5 flex items-center gap-3 text-xs" style={{ background: 'rgba(16,185,129,0.07)', borderBottom: '1px solid rgba(16,185,129,0.18)' }}>
      <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />
      <p className="flex-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        <strong className="text-emerald-300">Privacy & usage notice:</strong>{' '}
        This is a self-developed POC tool. Sprint data and metrics are <strong>not stored</strong> — processing is stateless and in-memory. Data is sent to{' '}
        <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="underline text-emerald-400">Anthropic&apos;s Claude API</a>
        {' '}for analysis only. AI-generated metrics are estimates and should be validated against your actual tooling. Not for regulated or sensitive data.
      </p>
      <button onClick={dismiss} className="p-1 rounded transition-colors hover:bg-white/[0.1] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
        <X size={14} />
      </button>
    </div>
  )
}
