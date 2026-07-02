export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import { verifyPasscode, unauthorizedResponse } from '@/lib/auth'
import type { MetricsReport } from '@/lib/types'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  if (!verifyPasscode(req.headers.get('x-access-code'))) return unauthorizedResponse()

  try {
    const { content, context } = await req.json() as { content: string; context?: string }

    if (!content?.trim() || content.trim().length < 20) {
      return NextResponse.json({ error: 'Please provide more data to analyse (at least a few lines of sprint/test data).' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: buildUserPrompt(content.trim(), context?.trim() ?? '') }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text : ''

    let report: MetricsReport
    try {
      const cleaned = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim()
      report = JSON.parse(cleaned)
    } catch (parseErr) {
      console.error('JSON parse error. Raw length:', raw.length, 'Stop reason:', message.stop_reason)
      console.error('Parse error:', parseErr)
      if (message.stop_reason === 'max_tokens') {
        return NextResponse.json({ error: 'Response was too long to process. Try reducing the amount of data or splitting it into smaller sections.' }, { status: 500 })
      }
      return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 })
    }

    return NextResponse.json(report)
  } catch (err) {
    console.error('Analyze error:', err)
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 })
  }
}
