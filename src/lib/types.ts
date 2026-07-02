export interface MetricValue {
  value: number | string
  unit?: string               // '%', 'hrs', 'days', 'bugs', etc.
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string         // e.g. "+3 from last sprint"
  status: 'good' | 'warn' | 'bad' | 'info'
  insight: string             // AI-generated 1-2 sentence explanation
}

export interface MetricGroup {
  id: string
  title: string
  icon: string                // emoji or identifier
  metrics: { label: string; metric: MetricValue }[]
}

export interface ChartDataPoint {
  name: string
  value: number
}

export interface MetricsReport {
  // Meta
  reportTitle: string
  sprintOrRelease: string     // e.g. "Sprint 23", "Release 2.4.1", or AI-inferred
  teamOrProject: string
  periodCovered: string       // e.g. "Q2 2024", "Oct 14–28"
  dataCompleteness: 'full' | 'partial' | 'estimated'
  dataCompletenessNote: string

  // Core metrics
  releaseQualityScore: MetricValue          // 0–100 composite
  defectEscapeRate: MetricValue             // % bugs reaching prod
  testCoverageScore: MetricValue            // % coverage
  automationRatio: MetricValue              // % automated vs total tests
  mttr: MetricValue                         // mean time to resolve
  defectDensity: MetricValue                // defects per feature/story point
  bugReopenRate: MetricValue                // % reopened bugs
  criticalDefects: MetricValue              // count of P1/P2 bugs

  // Grouped details
  metricGroups: MetricGroup[]

  // Chart data
  defectsByPriority: ChartDataPoint[]      // P1/P2/P3/P4 counts
  defectsByComponent: ChartDataPoint[]     // top components with bugs
  testResultBreakdown: ChartDataPoint[]    // Pass/Fail/Blocked/Skipped

  // Qualitative
  riskAreas: string[]         // components or areas flagged high-risk
  bottlenecks: string[]       // AI-identified QA/SDLC bottlenecks
  recommendations: string[]   // 3–5 actionable improvement suggestions
  strengths: string[]         // what went well

  // Executive summary
  executiveSummary: string    // 3–4 sentences for stakeholders
  healthSignal: 'Green' | 'Amber' | 'Red'
  healthSignalReason: string
}

export type AttachmentType = 'pdf' | 'docx' | 'excel' | 'csv' | 'image' | 'txt'

export interface Attachment {
  id: string
  name: string
  size: number
  extractedText: string
}
