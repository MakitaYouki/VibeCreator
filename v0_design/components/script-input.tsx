"use client"

import { FileText, Upload } from "lucide-react"

interface ScriptInputProps {
  value: string
  onChange: (value: string) => void
}

export function ScriptInput({ value, onChange }: ScriptInputProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0
  const charCount = value.length

  return (
    <div className="flex flex-col flex-1 rounded-xl border border-border bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/80">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground text-sm font-medium">Script Input</span>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-secondary/50"
        >
          <Upload className="h-3 w-3" />
          Import file
        </button>
      </div>

      {/* Textarea */}
      <div className="flex-1 relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your video script here...

Example:
[INTRO]
Hey everyone, welcome back to the channel. Today we're going to talk about something that's been on my mind for a while...

[MAIN CONTENT]
The first thing I want to address is...

[OUTRO]
If you found this helpful, make sure to like and subscribe..."
          className="w-full h-full min-h-[400px] resize-none bg-transparent px-5 py-4 text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none font-mono"
          spellCheck={false}
        />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-card/80">
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-[11px]">
            {wordCount.toLocaleString()} words
          </span>
          <span className="text-muted-foreground text-[11px]">
            {charCount.toLocaleString()} characters
          </span>
        </div>
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-muted-foreground hover:text-foreground text-[11px] transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
