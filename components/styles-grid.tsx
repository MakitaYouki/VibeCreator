"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Feather,
  Zap,
  BookOpen,
  Megaphone,
  GraduationCap,
  MessageCircle,
  Lightbulb,
  Briefcase,
  Heart,
} from "lucide-react"
import { StyleCard } from "@/components/style-card"

type DbStyle = {
  id: string | number
  name: string | null
  description: string | null
  config_json: unknown
}

const filterTabs = ["All", "Business", "Creative", "Technical", "Marketing"]

const iconCycle = [
  Briefcase,
  Feather,
  Zap,
  Lightbulb,
  Megaphone,
  GraduationCap,
  MessageCircle,
  BookOpen,
  Heart,
]

const gradients = [
  ["#22d3ee", "#0ea5e9"],
  ["#f472b6", "#e879f9"],
  ["#34d399", "#22d3ee"],
  ["#fbbf24", "#f97316"],
  ["#818cf8", "#6366f1"],
  ["#2dd4bf", "#14b8a6"],
  ["#fb923c", "#f97316"],
  ["#4ade80", "#22c55e"],
  ["#f9a8d4", "#f472b6"],
]

export function StylesGrid({
  styles,
  showCreateCard = true,
}: {
  styles: DbStyle[]
  showCreateCard?: boolean
}) {
  const [activeFilter, setActiveFilter] = useState("All")

  const decoratedStyles = useMemo(() => {
    return styles.map((style, index) => {
      const config =
        (style.config_json as Record<string, unknown> | null) ?? {}

      const rawName =
        (style.name ?? "") ||
        (typeof (config as any).style_name === "string"
          ? (config as any).style_name
          : "")

      const tone =
        style.description ??
        (typeof config.tone === "string" ? config.tone : "") ??
        ""
      const rawKeywords = (config as any).keywords
      let tags: string[] = []
      if (Array.isArray(rawKeywords)) {
        tags = rawKeywords
          .map((k) => (typeof k === "string" ? k : String(k)))
          .filter(Boolean)
      } else if (typeof rawKeywords === "string") {
        tags = rawKeywords
          .split(/[,;]/)
          .map((s) => s.trim())
          .filter(Boolean)
      }
      if (tags.length === 0 && tone) {
        tags = tone
          .split(/[,.]/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 3)
      }
      if (tags.length === 0) {
        tags = ["Custom", "Style"]
      }

      const Icon = iconCycle[index % iconCycle.length]
      const [from, to] = gradients[index % gradients.length]

      const displayName =
        String(rawName).trim() ||
        `Bilibili Style - ${String(style.id).slice(0, 8)}`

      const uses =
        typeof (config as any).uses === "number"
          ? (config as any).uses
          : 0

      return {
        styleId: String(style.id),
        title: displayName,
        description: tone || "Custom writing style",
        tags,
        icon: <Icon className="h-4 w-4" />,
        uses,
        gradientFrom: from,
        gradientTo: to,
      }
    })
  }, [styles])

  const filteredStyles = useMemo(() => {
    if (activeFilter === "All") return decoratedStyles
    return decoratedStyles.filter((style) =>
      style.tags.some((tag) =>
        tag.toLowerCase().includes(activeFilter.toLowerCase()),
      ),
    )
  }, [activeFilter, decoratedStyles])

  return (
    <div className="flex flex-col gap-5">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              activeFilter === tab
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredStyles.map((style) => (
          <StyleCard key={style.styleId} {...style} />
        ))}

        {showCreateCard && (
          <Link
            href="/analyze"
            className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-4 text-center text-sm text-muted-foreground shadow-sm transition hover:border-primary/40 hover:bg-card"
          >
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/5 text-primary">
              <span className="text-lg font-semibold">+</span>
            </div>
            <p className="font-medium text-foreground">Create new style</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Analyze a script to add a new persona.
            </p>
          </Link>
        )}
      </div>

      {/* Count */}
      <p className="py-2 text-center text-xs text-muted-foreground">
        {filteredStyles.length} style
        {filteredStyles.length !== 1 ? "s" : ""} in your library
      </p>
    </div>
  )
}

