"use client"

import React from "react"

import { CheckCircle2, Circle, Loader2, BarChart3, Clock, MessageSquare, Target, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type AnalysisStatus = "idle" | "running" | "complete"

interface AnalysisStep {
  label: string
  icon: React.ReactNode
  status: "pending" | "running" | "complete"
}

interface AnalysisResultsProps {
  status: AnalysisStatus
  progress: number
  steps: AnalysisStep[]
}

export function AnalysisResults({ status, progress, steps }: AnalysisResultsProps) {
  if (status === "idle") {
    return (
      <div className="flex flex-col flex-1 rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card/80">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground text-sm font-medium">Analysis Results</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50 border border-border">
            <Sparkles className="h-7 w-7 text-muted-foreground/50" />
          </div>
          <div className="text-center flex flex-col gap-1.5">
            <p className="text-foreground text-sm font-medium">Ready to analyze</p>
            <p className="text-muted-foreground text-xs max-w-[220px] leading-relaxed">
              Paste a video script and click Start Analysis to get AI-powered insights
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-card/80">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground text-sm font-medium">Analysis Results</span>
        </div>
        {status === "running" && (
          <span className="text-primary text-xs font-medium">{progress}%</span>
        )}
        {status === "complete" && (
          <span className="text-emerald-400 text-xs font-medium">Complete</span>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-[2px] w-full bg-secondary">
        <div
          className={cn(
            "h-full transition-all duration-500 ease-out",
            status === "complete" ? "bg-emerald-400" : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex flex-col p-4 gap-3">
        {steps.map((step) => (
          <div
            key={step.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
              step.status === "running" && "bg-primary/5 border border-primary/20",
              step.status === "complete" && "bg-secondary/30",
              step.status === "pending" && "opacity-50"
            )}
          >
            <div className="shrink-0">
              {step.status === "complete" && (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              )}
              {step.status === "running" && (
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
              )}
              {step.status === "pending" && (
                <Circle className="h-4 w-4 text-muted-foreground/40" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{step.icon}</span>
              <span
                className={cn(
                  "text-sm",
                  step.status === "complete" && "text-foreground",
                  step.status === "running" && "text-foreground font-medium",
                  step.status === "pending" && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Results preview (when complete) */}
      {status === "complete" && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          <div className="h-px w-full bg-border" />
          <p className="text-foreground text-xs font-medium">Summary</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Tone", value: "Conversational" },
              { label: "Pacing", value: "Well-balanced" },
              { label: "Hooks", value: "3 found" },
              { label: "CTA Strength", value: "Strong" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-secondary/50 px-3 py-2">
                <p className="text-muted-foreground text-[10px] uppercase tracking-wider">{item.label}</p>
                <p className="text-foreground text-xs font-medium mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-secondary/50 px-3 py-2.5">
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-1">AI Recommendation</p>
            <p className="text-foreground text-xs leading-relaxed">
              Strong opening hook. Consider adding a mid-roll engagement prompt around the 3-minute mark. The outro CTA is effective but could benefit from a stronger emotional close.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export const defaultSteps: AnalysisStep[] = [
  { label: "Parsing script structure", icon: <MessageSquare className="h-3.5 w-3.5" />, status: "pending" },
  { label: "Analyzing tone & voice", icon: <Target className="h-3.5 w-3.5" />, status: "pending" },
  { label: "Evaluating pacing", icon: <Clock className="h-3.5 w-3.5" />, status: "pending" },
  { label: "Identifying hooks & CTAs", icon: <Sparkles className="h-3.5 w-3.5" />, status: "pending" },
  { label: "Generating recommendations", icon: <BarChart3 className="h-3.5 w-3.5" />, status: "pending" },
]
