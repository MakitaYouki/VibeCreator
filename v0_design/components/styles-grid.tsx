"use client"

import { useState } from "react"
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

const writingStyles = [
  {
    title: "Professional Tone",
    description: "Crisp, authoritative language suited for business communication, reports, and executive summaries.",
    tags: ["Business", "Formal", "Corporate"],
    icon: <Briefcase className="h-4 w-4" />,
    uses: 342,
    gradientFrom: "#22d3ee",
    gradientTo: "#0ea5e9",
  },
  {
    title: "Creative Storyteller",
    description: "Vivid, imaginative prose that brings narratives to life with rich descriptions and engaging flow.",
    tags: ["Creative", "Narrative", "Engaging"],
    icon: <Feather className="h-4 w-4" />,
    uses: 218,
    gradientFrom: "#f472b6",
    gradientTo: "#e879f9",
  },
  {
    title: "Technical Writer",
    description: "Clear, precise documentation-style writing perfect for guides, API docs, and technical content.",
    tags: ["Technical", "Documentation", "Clear"],
    icon: <Zap className="h-4 w-4" />,
    uses: 187,
    gradientFrom: "#34d399",
    gradientTo: "#22d3ee",
  },
  {
    title: "Thought Leadership",
    description: "Insightful, forward-thinking content designed to establish authority and inspire industry discourse.",
    tags: ["Opinion", "Insights", "Authority"],
    icon: <Lightbulb className="h-4 w-4" />,
    uses: 156,
    gradientFrom: "#fbbf24",
    gradientTo: "#f97316",
  },
  {
    title: "Social Media Voice",
    description: "Punchy, scroll-stopping copy optimized for engagement across platforms like X, LinkedIn, and Instagram.",
    tags: ["Social", "Short-form", "Viral"],
    icon: <Megaphone className="h-4 w-4" />,
    uses: 291,
    gradientFrom: "#818cf8",
    gradientTo: "#6366f1",
  },
  {
    title: "Academic Researcher",
    description: "Scholarly, evidence-based writing with proper citations and structured argumentation for papers.",
    tags: ["Academic", "Research", "Formal"],
    icon: <GraduationCap className="h-4 w-4" />,
    uses: 94,
    gradientFrom: "#2dd4bf",
    gradientTo: "#14b8a6",
  },
  {
    title: "Conversational Blogger",
    description: "Friendly, approachable voice that connects with readers through relatable, easy-to-digest content.",
    tags: ["Blog", "Casual", "Relatable"],
    icon: <MessageCircle className="h-4 w-4" />,
    uses: 173,
    gradientFrom: "#fb923c",
    gradientTo: "#f97316",
  },
  {
    title: "SEO Copywriter",
    description: "Keyword-aware content that balances search engine optimization with natural, readable language.",
    tags: ["SEO", "Marketing", "Web Copy"],
    icon: <BookOpen className="h-4 w-4" />,
    uses: 265,
    gradientFrom: "#4ade80",
    gradientTo: "#22c55e",
  },
  {
    title: "Empathetic Brand Voice",
    description: "Warm, human-centered messaging that builds trust and emotional connection with your audience.",
    tags: ["Brand", "Empathetic", "Trust"],
    icon: <Heart className="h-4 w-4" />,
    uses: 128,
    gradientFrom: "#f9a8d4",
    gradientTo: "#f472b6",
  },
]

const filterTabs = ["All", "Business", "Creative", "Technical", "Marketing"]

export function StylesGrid() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredStyles =
    activeFilter === "All"
      ? writingStyles
      : writingStyles.filter((style) =>
          style.tags.some(
            (tag) =>
              tag.toLowerCase().includes(activeFilter.toLowerCase()) ||
              activeFilter.toLowerCase().includes(tag.toLowerCase())
          )
        )

  return (
    <div className="flex flex-col gap-5">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              activeFilter === tab
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStyles.map((style) => (
          <StyleCard key={style.title} {...style} />
        ))}
      </div>

      {/* Count */}
      <p className="text-muted-foreground text-xs text-center py-2">
        {filteredStyles.length} style{filteredStyles.length !== 1 ? "s" : ""} in your library
      </p>
    </div>
  )
}
