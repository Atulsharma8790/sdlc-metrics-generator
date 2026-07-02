'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthCtx {
  isUnlocked: boolean
  unlock: (code: string) => Promise<boolean>
  lock: () => void
  getHeaders: () => Record<string, string>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [passcode, setPasscode] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('metrics_tool_access_code')
    if (stored) setPasscode(stored)
  }, [])

  async function unlock(code: string): Promise<boolean> {
    const res = await fetch('/api/auth/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    if (res.ok) {
      sessionStorage.setItem('metrics_tool_access_code', code)
      setPasscode(code)
      return true
    }
    return false
  }

  function lock() {
    sessionStorage.removeItem('metrics_tool_access_code')
    setPasscode(null)
  }

  function getHeaders(): Record<string, string> {
    return passcode ? { 'x-access-code': passcode } : {}
  }

  return (
    <Ctx.Provider value={{ isUnlocked: passcode !== null, unlock, lock, getHeaders }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
