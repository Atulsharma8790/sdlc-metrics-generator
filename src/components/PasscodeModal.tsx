'use client'

import { useState } from 'react'
import { X, Lock, ChevronRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/auth'
import { PORTFOLIO_URL } from '@/lib/config'

interface Props {
  onClose: () => void
  onUnlocked?: () => void
}

export function PasscodeModal({ onClose, onUnlocked }: Props) {
  const { unlock } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    const ok = await unlock(code.trim())
    setLoading(false)
    if (ok) {
      onClose()
      onUnlocked?.()
    } else {
      setError('Incorrect passcode. Request access below.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl shadow-2xl animate-fade-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-white/[0.07]" style={{ color: 'var(--text-muted)' }}>
          <X size={16} />
        </button>

        <div className="p-7">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 mx-auto" style={{ background: 'linear-gradient(135deg, #10B981, #F59E0B)' }}>
            <Lock size={20} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-center mb-1" style={{ color: 'var(--text-primary)' }}>Unlock Metrics Generator</h2>
          <p className="text-sm text-center mb-6" style={{ color: 'var(--text-muted)' }}>Enter the access passcode to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter passcode…"
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all input-themed"
              style={{ background: 'var(--bg-elevated)', border: `1px solid ${error ? '#EF4444' : 'var(--border-mid)'}`, color: 'var(--text-primary)' }}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
              style={{ background: 'linear-gradient(135deg, #10B981, #F59E0B)' }}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <><ChevronRight size={15} /> Unlock</>}
            </button>
          </form>

          <p className="text-xs text-center mt-5" style={{ color: 'var(--text-dimmer)' }}>
            Don&apos;t have access?{' '}
            <a href={`${PORTFOLIO_URL}#contact`} target="_blank" rel="noopener noreferrer" className="underline text-emerald-400">
              Request access
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
