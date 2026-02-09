"use client"

import React from "react"
import { Sparkles, User, Copy, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let inCodeBlock = false
  let codeBuffer: string[] = []
  let codeLang = ""

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Code block fence
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${i}`} className="my-3 rounded-lg overflow-hidden border border-border">
            {codeLang && (
              <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/80 border-b border-border">
                <span className="text-muted-foreground text-[10px] font-mono uppercase tracking-wider">{codeLang}</span>
              </div>
            )}
            <pre className="px-4 py-3 overflow-x-auto bg-secondary/30">
              <code className="text-foreground text-xs font-mono leading-relaxed">{codeBuffer.join("\n")}</code>
            </pre>
          </div>
        )
        codeBuffer = []
        codeLang = ""
        inCodeBlock = false
      } else {
        inCodeBlock = true
        codeLang = line.slice(3).trim()
      }
      continue
    }

    if (inCodeBlock) {
      codeBuffer.push(line)
      continue
    }

    // Headings
    if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-foreground font-semibold text-sm mt-4 mb-1.5">{line.slice(4)}</h3>)
      continue
    }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-foreground font-semibold text-base mt-4 mb-1.5">{line.slice(3)}</h2>)
      continue
    }

    // Bullet points
    if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={i} className="flex gap-2 ml-1">
          <span className="text-muted-foreground mt-1 shrink-0">&#x2022;</span>
          <span className="text-foreground text-sm leading-relaxed">{renderInline(line.slice(2))}</span>
        </div>
      )
      continue
    }

    // Numbered list
    const numberedMatch = line.match(/^(\d+)\.\s(.+)/)
    if (numberedMatch) {
      elements.push(
        <div key={i} className="flex gap-2 ml-1">
          <span className="text-muted-foreground text-sm shrink-0">{numberedMatch[1]}.</span>
          <span className="text-foreground text-sm leading-relaxed">{renderInline(numberedMatch[2])}</span>
        </div>
      )
      continue
    }

    // Empty lines
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />)
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-foreground text-sm leading-relaxed">{renderInline(line)}</p>
    )
  }

  return <>{elements}</>
}

function renderInline(text: string): React.ReactNode {
  // Handle bold, inline code, and italic
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    // Inline code: `text`
    const codeMatch = remaining.match(/`([^`]+)`/)

    let firstMatch: { index: number; length: number; type: "bold" | "code"; content: string } | null = null

    if (boldMatch?.index !== undefined) {
      firstMatch = { index: boldMatch.index, length: boldMatch[0].length, type: "bold", content: boldMatch[1] }
    }
    if (codeMatch?.index !== undefined) {
      if (!firstMatch || codeMatch.index < firstMatch.index) {
        firstMatch = { index: codeMatch.index, length: codeMatch[0].length, type: "code", content: codeMatch[1] }
      }
    }

    if (firstMatch) {
      if (firstMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, firstMatch.index)}</span>)
      }
      if (firstMatch.type === "bold") {
        parts.push(<strong key={key++} className="text-foreground font-semibold">{firstMatch.content}</strong>)
      } else {
        parts.push(
          <code key={key++} className="bg-secondary/80 text-foreground px-1.5 py-0.5 rounded text-xs font-mono">
            {firstMatch.content}
          </code>
        )
      }
      remaining = remaining.slice(firstMatch.index + firstMatch.length)
    } else {
      parts.push(<span key={key++}>{remaining}</span>)
      remaining = ""
    }
  }

  return <>{parts}</>
}

interface ChatMessagesProps {
  messages: ChatMessage[]
  isTyping: boolean
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div className="text-center flex flex-col gap-1.5 max-w-sm">
          <h2 className="text-foreground text-base font-semibold">Start writing</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Describe what you want to create. The AI will use your selected writing style to craft the content.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto flex flex-col gap-0 py-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 px-4 md:px-6 py-5",
              message.role === "user" ? "bg-transparent" : "bg-secondary/20"
            )}
          >
            {/* Avatar */}
            <div className="shrink-0 mt-0.5">
              {message.role === "assistant" ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary border border-border">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-foreground text-xs font-medium">
                  {message.role === "assistant" ? "StyleForge AI" : "You"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {renderMarkdown(message.content)}
              </div>
              {message.role === "assistant" && (
                <div className="flex items-center gap-1 mt-2">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-[11px] px-2 py-1 rounded-md hover:bg-secondary/50 transition-colors"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-[11px] px-2 py-1 rounded-md hover:bg-secondary/50 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Regenerate
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 px-4 md:px-6 py-5 bg-secondary/20">
            <div className="shrink-0 mt-0.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
