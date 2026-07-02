'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { MetricValue } from '@/lib/types'

const STATUS_STYLES: Record<MetricValue['status'], { color: string; bg: string }> = {
  good: { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  warn: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  bad:  { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  info: { color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
}

interface Props {
  label: string
  metric: MetricValue
  large?: boolean
}

export function MetricCard({ label, metric, large = false }: Props) {
  const style = STATUS_STYLES[metric.status]

  const TrendIcon = metric.trend === 'up'
    ? TrendingUp
    : metric.trend === 'down'
    ? TrendingDown
    : Minus

  const trendColor = metric.trend === 'up'
    ? (metric.status === 'good' ? '#10B981' : '#EF4444')
    : metric.trend === 'down'
    ? (metric.status === 'good' ? '#EF4444' : '#10B981')
    : '#6B7F96'

  return (
    <div className="rounded-xl p-4" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs font-medium leading-tight" style={{ color: 'var(--text-muted)' }}>{label}</p>
        {metric.trend && metric.trend !== 'neutral' && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <TrendIcon size={11} style={{ color: trendColor }} />
            {metric.trendLabel && <span className="text-xs" style={{ color: trendColor }}>{metric.trendLabel}</span>}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mb-2">
        <span
          className={`font-black leading-none ${large ? 'text-3xl' : 'text-2xl'}`}
          style={{ color: style.color }}
        >
          {typeof metric.value === 'number'
            ? metric.unit === '%' ? `${metric.value}%`
            : `${metric.value}${metric.unit ? ` ${metric.unit}` : ''}`
            : metric.value
          }
        </span>
        {metric.unit && metric.unit !== '%' && typeof metric.value === 'number' && (
          <span className="text-xs" style={{ color: 'var(--text-dimmer)' }}>{metric.unit}</span>
        )}
      </div>

      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-dimmer)' }}>{metric.insight}</p>
    </div>
  )
}
