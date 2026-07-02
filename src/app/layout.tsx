import { Suspense } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/auth'
import { ThemeProvider } from '@/context/theme'
import { DisclaimerBanner } from '@/components/DisclaimerBanner'
import PortfolioBar from '@/components/PortfolioBar'


export const metadata: Metadata = {
  title: 'SDLC Metrics Generator — AI-Powered QA & Sprint Quality Reports',
  description:
    'Paste sprint data, test results, or defect logs and get a structured QA metrics report: defect escape rate, MTTR, test coverage, automation ratio, release quality score, and more. Built by Atul Sharma.',
  keywords: ['QA metrics', 'SDLC metrics', 'sprint quality', 'defect escape rate', 'MTTR', 'test coverage', 'release quality', 'QA reporting', 'engineering metrics'],
  authors: [{ name: 'Atul Sharma', url: process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? 'https://atulsharma.vercel.app' }],
  openGraph: {
    title: 'SDLC Metrics Generator',
    description: 'AI-powered sprint & release quality metrics from raw data.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <Suspense fallback={null}><PortfolioBar /></Suspense>
        <ThemeProvider>
          <AuthProvider>
            <DisclaimerBanner />
            {children}
          </AuthProvider>
        </ThemeProvider>
      <Suspense fallback={null}><PortfolioBar /></Suspense></body>
    </html>
  )
}
