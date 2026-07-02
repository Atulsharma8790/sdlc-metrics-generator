export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { verifyPasscode, unauthorizedResponse } from '@/lib/auth'
import { extractText } from '@/lib/extractors'

export async function POST(req: NextRequest) {
  if (!verifyPasscode(req.headers.get('x-access-code'))) return unauthorizedResponse()
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''

    const extractedText = await extractText(buffer, ext, file.type, file.name)
    return NextResponse.json({ name: file.name, size: file.size, extractedText })
  } catch (err) {
    console.error('Extract error:', err)
    return NextResponse.json({ error: 'Failed to process file.' }, { status: 500 })
  }
}
