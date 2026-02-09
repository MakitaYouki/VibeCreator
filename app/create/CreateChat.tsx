'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

type Message = { role: 'user' | 'assistant'; content: string; id: string }

type Props = {
  styleId: string
  styleName: string
  styleConfig: Record<string, unknown>
}

const WELCOME_ID = 'welcome'

function buildWelcomeMessage(styleName: string): Message {
  return {
    role: 'assistant',
    content: `Target style loaded. I'm ready to write in the style of ${styleName}. What topic should we tackle today?`,
    id: WELCOME_ID,
  }
}

export default function CreateChat({ styleId, styleName, styleConfig }: Props) {
  const [messages, setMessages] = useState<Message[]>(() => [buildWelcomeMessage(styleName)])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim(), id: `u-${Date.now()}` }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    const assistantId = `a-${Date.now()}`
    setMessages((prev) => [...prev, { role: 'assistant', content: '', id: assistantId }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          conversation_id: conversationId,
          style_config: styleConfig,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Request failed (${res.status})`)
      }

      const reader = res.body?.getReader()
      if (!reader) {
        setLoading(false)
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''
      let newConversationId: string | null = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue
          const raw = trimmed.slice(6).trim()
          if (raw === '[DONE]' || raw === '') continue
          try {
            const data = JSON.parse(raw) as { answer?: string; conversation_id?: string }
            if (data.conversation_id) newConversationId = data.conversation_id
            if (data.answer != null && data.answer !== '') {
              const delta = typeof data.answer === 'string' ? data.answer : String(data.answer)
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + delta } : m
                )
              )
              messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
            }
          } catch {
            // skip malformed or partial JSON
          }
        }
      }

      if (buffer.trim()) {
        const trimmed = buffer.trim()
        if (trimmed.startsWith('data: ')) {
          const raw = trimmed.slice(6).trim()
          if (raw !== '[DONE]' && raw !== '') {
            try {
              const data = JSON.parse(raw) as { answer?: string; conversation_id?: string }
              if (data.conversation_id) newConversationId = data.conversation_id
              if (data.answer != null && data.answer !== '') {
                const delta = typeof data.answer === 'string' ? data.answer : String(data.answer)
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: m.content + delta } : m
                  )
                )
              }
            } catch {
              // skip
            }
          }
        }
      }

      if (newConversationId) setConversationId(newConversationId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const resetChat = () => {
    setMessages([buildWelcomeMessage(styleName)])
    setConversationId(null)
    setError(null)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-xl border border-border bg-card shadow-sm">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="hidden flex-col text-xs text-muted-foreground sm:flex">
            <span className="text-[11px] uppercase tracking-wide">Creation</span>
            <span className="text-sm font-medium text-foreground">
              {styleName}
            </span>
          </div>
          <div className="flex flex-col text-xs text-muted-foreground sm:hidden">
            <span className="text-sm font-medium text-foreground">
              {styleName}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={resetChat}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          Reset chat
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4"
      >
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p className="text-center text-sm">Send a message to start creating with this style.</p>
          </div>
        )}
        <ul className="space-y-6">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground'
                }`}
              >
                <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                  {m.content || (m.role === 'assistant' && loading ? '…' : '')}
                </div>
                {m.role === 'assistant' && m.content && (
                  <button
                    type="button"
                    onClick={() => copyContent(m.content)}
                    className="mt-2 rounded-lg bg-background/20 px-2 py-1 text-xs font-medium text-foreground transition hover:bg-background/40"
                  >
                    Copy Result
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 border-t border-slate-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
