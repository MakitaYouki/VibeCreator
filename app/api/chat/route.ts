import { NextRequest, NextResponse } from 'next/server'

// Use DIFY_CHAT_API_URL if your chat app has a different base URL; else falls back to DIFY_API_URL
const CHAT_API_URL = process.env.DIFY_CHAT_API_URL || process.env.DIFY_API_URL
const CHAT_API_KEY = process.env.DIFY_CHAT_API_KEY

export async function POST(req: NextRequest) {
  if (!CHAT_API_URL?.trim() || !CHAT_API_KEY?.trim()) {
    return NextResponse.json(
      { error: 'DIFY_CHAT_API_KEY and Dify chat API URL must be set' },
      { status: 500 }
    )
  }

  let body: { message: string; conversation_id?: string; style_config?: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { message, conversation_id, style_config } = body
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'message is required' }, { status: 400 })
  }

  const baseUrl = CHAT_API_URL.replace(/\/$/, '')
  const url = `${baseUrl}/chat-messages`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${CHAT_API_KEY}`,
    },
    body: JSON.stringify({
      query: message,
      user: 'vibe-creator-user',
      response_mode: 'streaming',
      conversation_id: conversation_id || undefined,
      // Silent system context: style config + instruction to never ask for style (user already chose it).
      inputs:
        style_config && Object.keys(style_config).length > 0
          ? {
              style_prompt:
                '[System: The user has already selected this style. Do not ask what style they want; only use it. Style configuration: ]' +
                JSON.stringify(style_config),
            }
          : undefined,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json(
      { error: `Dify API error (${res.status}): ${text.slice(0, 400)}` },
      { status: res.status }
    )
  }

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('text/event-stream')) {
    return NextResponse.json(
      { error: 'Dify did not return a stream' },
      { status: 502 }
    )
  }

  const stream = res.body
  if (!stream) {
    return NextResponse.json({ error: 'No response body' }, { status: 502 })
  }

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
