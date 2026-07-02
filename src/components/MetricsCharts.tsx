'use client'

import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ChartDataPoint } from '@/lib/types'
import { useTheme } from '@/context/theme'

const PIE_COLORS = ['#10B981', '#EF4444', '#F59E0B', '#94A3B8']
const BAR_COLORS = ['#EF4444', '#F97316', '#F59E0B', '#94A3B8']

interface Props {
  defectsByPriority: ChartDataPoint[]
  defectsByComponent: ChartDataPoint[]
  testResultBreakdown: ChartDataPoint[]
}

export function MetricsCharts({ defectsByPriority, defectsByComponent, testResultBreakdown }: Props) {
  const { theme } = useTheme()
  const textColor = theme === 'light' ? '#475569' : '#94A3B8'
  const gridColor = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
      {/* Test result pie */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Test Results</h4>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={testResultBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
              {testResultBreakdown.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12, color: 'var(--text-primary)' }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: textColor }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Defects by priority */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Defects by Priority</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={defectsByPriority} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: textColor }} />
            <YAxis tick={{ fontSize: 10, fill: textColor }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12, color: 'var(--text-primary)' }}
            />
            <Bar dataKey="value" radius={[4,4,0,0]}>
              {defectsByPriority.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Defects by component */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Defects by Component</h4>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={defectsByComponent.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: textColor }} />
            <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10, fill: textColor }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: 8, fontSize: 12, color: 'var(--text-primary)' }}
            />
            <Bar dataKey="value" fill="#10B981" radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
