"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowUp, Paperclip, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [value])

  const handleSubmit = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-3">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-secondary/30 px-3 py-2 focus-within:border-primary/40 transition-colors">
          <button
            type="button"
            className="shrink-0 mb-0.5 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary/50"
            aria-label="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the content you want to create..."
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:outline-none min-h-[24px] max-h-[160px] py-0.5 disabled:opacity-50"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!value.trim() || disabled}
            className={cn(
              "shrink-0 mb-0.5 flex h-7 w-7 items-center justify-center rounded-lg transition-all",
              value.trim() && !disabled
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-muted-foreground/40 cursor-not-allowed"
            )}
            aria-label="Send message"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 mt-2">
          <Sparkles className="h-2.5 w-2.5 text-muted-foreground/40" />
          <p className="text-muted-foreground/40 text-[10px]">
            AI generates content using your selected writing style
          </p>
        </div>
      </div>
    </div>
  )
}
