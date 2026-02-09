"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { Sparkles, Loader2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ScriptInput } from "@/components/script-input"
import { AnalysisResults, defaultSteps } from "@/components/analysis-results"

type AnalysisStatus = "idle" | "running" | "complete"

export default function AnalyzePage() {
  const [script, setScript] = useState("")
  const [status, setStatus] = useState<AnalysisStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [steps, setSteps] = useState(defaultSteps)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startAnalysis = useCallback(() => {
    if (!script.trim()) return

    setStatus("running")
    setProgress(0)

    const freshSteps = defaultSteps.map((s) => ({ ...s, status: "pending" as const }))
    setSteps(freshSteps)

    let currentStep = 0
    const totalSteps = freshSteps.length

    const advanceStep = () => {
      if (currentStep < totalSteps) {
        setSteps((prev) =>
          prev.map((s, i) => ({
            ...s,
            status: i < currentStep ? "complete" as const : i === currentStep ? "running" as const : "pending" as const,
          }))
        )
        setProgress(Math.round(((currentStep + 0.5) / totalSteps) * 100))

        timerRef.current = setTimeout(() => {
          setSteps((prev) =>
            prev.map((s, i) => ({
              ...s,
              status: i <= currentStep ? "complete" as const : i === currentStep + 1 ? "running" as const : "pending" as const,
            }))
          )
          setProgress(Math.round(((currentStep + 1) / totalSteps) * 100))
          currentStep++
          advanceStep()
        }, 1200 + Math.random() * 800)
      } else {
        setStatus("complete")
        setProgress(100)
      }
    }

    advanceStep()
  }, [script])

  const isDisabled = !script.trim() || status === "running"

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-border bg-card/30 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <button type="button" className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 md:hidden">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-foreground font-semibold text-sm">StyleForge</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
                        Home
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm">Script Analysis</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          {/* Magic button */}
          <Button
            onClick={startAnalysis}
            disabled={isDisabled}
            className="relative h-9 gap-2 text-sm font-medium overflow-hidden disabled:opacity-40"
            style={{
              background: isDisabled
                ? undefined
                : "linear-gradient(135deg, hsl(190, 80%, 50%), hsl(220, 80%, 55%))",
            }}
          >
            <span className="relative flex items-center gap-2 text-primary-foreground">
              {status === "running" ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span className="hidden sm:inline">
                {status === "running" ? "Analyzing..." : status === "complete" ? "Re-Analyze" : "Start Analysis"}
              </span>
              <span className="sm:hidden">
                {status === "running" ? "..." : "Analyze"}
              </span>
            </span>
          </Button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            {/* Mobile breadcrumb */}
            <div className="md:hidden mb-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/" className="text-muted-foreground hover:text-foreground text-xs">
                        Home
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs">Script Analysis</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 lg:h-[calc(100vh-8rem)]">
              {/* Left: Script Input */}
              <div className="flex flex-col lg:flex-1 lg:min-w-0">
                <ScriptInput value={script} onChange={setScript} />
              </div>

              {/* Right: Analysis Results */}
              <div className="flex flex-col lg:w-[380px] xl:w-[420px] shrink-0">
                <AnalysisResults
                  status={status}
                  progress={progress}
                  steps={steps}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
