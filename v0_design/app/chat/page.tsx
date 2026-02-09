"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { Sparkles, Menu, PanelLeftClose, PanelLeft } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ChatStyleSidebar } from "@/components/chat-style-sidebar"
import { ChatMessages, type ChatMessage } from "@/components/chat-messages"
import { ChatInput } from "@/components/chat-input"
import { Button } from "@/components/ui/button"

const SIMULATED_RESPONSES: Record<string, string> = {
  default: `Here's a draft based on your request:

## Content Draft

Thank you for your prompt. I've crafted the following content using the **Professional Tone** writing style, which emphasizes clarity, authority, and a polished voice.

### Key Points

- **Clear structure** with logical flow between ideas
- **Active voice** to maintain reader engagement
- **Concise language** that respects the reader's time

### Opening Paragraph

In today's rapidly evolving landscape, organizations must adapt their communication strategies to remain competitive. This requires not only a deep understanding of audience needs but also the ability to articulate value propositions with precision and confidence.

### Suggested Next Steps

1. Review the draft for alignment with your brand guidelines
2. Consider adding specific data points or case studies
3. Adjust the call-to-action based on your campaign goals

Would you like me to refine any section, adjust the tone, or expand on a particular point?`,

  intro: `## Introduction Draft

**Compelling Hook:** In an era where attention is the most valuable currency, the first impression your content makes can determine its entire trajectory.

This opening is designed to:

- **Capture attention** within the first 3 seconds
- **Establish credibility** through confident, authoritative language
- **Set expectations** for what the reader will gain

### Alternative Hooks

1. *Question-based:* "What if the difference between a good and great piece of content was just one paragraph?"
2. *Data-driven:* "Studies show that 80% of readers decide within 10 seconds whether to continue reading."
3. *Story-based:* "When Sarah launched her first newsletter, she had exactly 3 subscribers..."

Which approach resonates most with your audience? I can develop any of these further.`,

  rewrite: `## Rewritten for Clarity

I've restructured the content with these improvements:

### Changes Made

- **Simplified sentence structure** - Broke complex sentences into digestible chunks
- **Removed jargon** - Replaced technical terms with accessible alternatives
- **Added transitions** - Improved flow between paragraphs with connecting phrases
- **Strengthened verbs** - Replaced passive voice with active, dynamic language

### Before vs After

\`\`\`
Before: "The implementation of the solution was facilitated by the team."
After:  "The team implemented the solution."
\`\`\`

The revised version reads at a **Grade 8 level**, making it accessible to 85% of English-speaking adults while maintaining a professional tone.

Want me to adjust the reading level or make further refinements?`,
}

function getSimulatedResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  if (lower.includes("intro") || lower.includes("opening") || lower.includes("start")) {
    return SIMULATED_RESPONSES.intro
  }
  if (lower.includes("rewrite") || lower.includes("clarity") || lower.includes("simplify") || lower.includes("improve")) {
    return SIMULATED_RESPONSES.rewrite
  }
  return SIMULATED_RESPONSES.default
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [styleBarVisible, setStyleBarVisible] = useState(true)
  const idCounter = useRef(0)

  const handleSend = useCallback((content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${idCounter.current++}`,
      role: "user",
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${idCounter.current++}`,
        role: "assistant",
        content: getSimulatedResponse(content),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500 + Math.random() * 1000)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />

      <div className="flex flex-1 overflow-hidden">
        {/* Style metadata sidebar */}
        {styleBarVisible && (
          <ChatStyleSidebar
            styleName="Professional Tone"
            description="Crisp, authoritative language suited for business communication, reports, and executive summaries."
            tags={["Business", "Formal", "Corporate"]}
          />
        )}

        {/* Chat area */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Chat header */}
          <header className="flex items-center justify-between h-14 px-4 md:px-5 border-b border-border bg-card/30 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <button type="button" className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 md:hidden">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-foreground font-semibold text-sm">StyleForge</span>
                </Link>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStyleBarVisible(!styleBarVisible)}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  {styleBarVisible ? (
                    <PanelLeftClose className="h-4 w-4" />
                  ) : (
                    <PanelLeft className="h-4 w-4" />
                  )}
                  <span className="sr-only">Toggle style sidebar</span>
                </Button>
                <div className="h-4 w-px bg-border" />
                <h1 className="text-foreground text-sm font-medium">New Conversation</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/50">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-muted-foreground text-[11px]">Professional Tone</span>
              </div>
            </div>
          </header>

          {/* Messages */}
          <ChatMessages messages={messages} isTyping={isTyping} />

          {/* Input */}
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  )
}
