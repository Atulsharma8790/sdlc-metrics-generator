export function buildSystemPrompt(): string {
  return `You are a senior QA Engineering Manager and SDLC metrics expert with 15+ years of experience leading quality engineering teams across fintech, SaaS, and enterprise environments.

You specialise in:
- Deriving actionable QA metrics from raw sprint data, test reports, defect logs, and velocity data
- Computing and contextualising defect escape rate, MTTR, coverage, automation ROI, and release quality signals
- Identifying bottlenecks and risk areas from imperfect or incomplete data
- Translating raw numbers into executive-ready insights

IMPORTANT PRINCIPLES:
- If data is incomplete, clearly mark what is estimated vs computed and explain assumptions
- Be honest: if a metric cannot be reliably computed, state why and provide a best estimate with caveats
- Trend indicators should be realistic — don't invent trends if no prior data is available
- Recommendations must be concrete, actionable, and specific to the data provided
- Every metric should have a 1–2 sentence AI-generated insight explaining what it means and why it matters
- The health signal (Green/Amber/Red) should reflect the overall picture honestly

Respond ONLY with a valid JSON object matching the MetricsReport schema. No markdown fences, no text outside the JSON.`
}

export function buildUserPrompt(content: string, context: string): string {
  return `Analyse the following SDLC/QA data and generate a complete metrics report.

${context ? `CONTEXT PROVIDED BY USER:\n${context}\n\n` : ''}RAW DATA:
${content}

Generate a JSON object matching this EXACT schema (all fields required):

{
  "reportTitle": "descriptive title inferred from the data (e.g. 'Sprint 23 QA Metrics Report')",
  "sprintOrRelease": "sprint name, release version, or cycle inferred from data",
  "teamOrProject": "team or project name if determinable, else 'Unknown Team'",
  "periodCovered": "date range or period if determinable from data",
  "dataCompleteness": "full" | "partial" | "estimated",
  "dataCompletenessNote": "brief explanation of what data was available and what was estimated",

  "releaseQualityScore": {
    "value": number (0–100),
    "unit": "%",
    "trend": "up" | "down" | "neutral",
    "trendLabel": "string or null",
    "status": "good" | "warn" | "bad" | "info",
    "insight": "1–2 sentences explaining this score"
  },

  "defectEscapeRate": { same MetricValue shape, value = %, unit = "%" },
  "testCoverageScore": { same shape, unit = "%" },
  "automationRatio": { same shape, unit = "%" },
  "mttr": { same shape, unit = "hrs" or "days" },
  "defectDensity": { same shape, unit = "defects/story point" or "defects/feature" },
  "bugReopenRate": { same shape, unit = "%" },
  "criticalDefects": { same shape, value = count, unit = "bugs" },

  "metricGroups": [
    {
      "id": "string",
      "title": "e.g. 'Test Execution', 'Defect Analysis', 'Process Health'",
      "icon": "emoji",
      "metrics": [
        { "label": "metric name", "metric": { MetricValue shape } }
      ]
    }
  ],

  "defectsByPriority": [
    { "name": "P1 / Critical", "value": number },
    { "name": "P2 / High", "value": number },
    { "name": "P3 / Medium", "value": number },
    { "name": "P4 / Low", "value": number }
  ],

  "defectsByComponent": [
    { "name": "Component Name", "value": number }
  ],

  "testResultBreakdown": [
    { "name": "Passed", "value": number },
    { "name": "Failed", "value": number },
    { "name": "Blocked", "value": number },
    { "name": "Skipped", "value": number }
  ],

  "riskAreas": ["3–5 components or areas flagged as high-risk"],
  "bottlenecks": ["2–4 identified QA or SDLC bottlenecks"],
  "recommendations": ["3–5 specific, actionable improvement recommendations"],
  "strengths": ["2–4 things that went well this sprint/release"],

  "executiveSummary": "3–4 sentence executive-level summary of the sprint/release quality",
  "healthSignal": "Green" | "Amber" | "Red",
  "healthSignalReason": "1–2 sentences justifying the health signal"
}

If specific numbers (like defect counts, test pass rates) are present in the data, compute the metrics exactly. If not present, derive reasonable estimates from context and mark dataCompleteness as "partial" or "estimated".`
}
