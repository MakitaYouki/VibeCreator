"use client"

import { Briefcase, Hash, Star, Clock, BarChart3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ChatStyleSidebarProps {
  styleName: string
  description: string
  tags: string[]
}

export function ChatStyleSidebar({ styleName, description, tags }: ChatStyleSidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-[240px] border-r border-border bg-card/30 shrink-0 overflow-y-auto">
      {/* Style info */}
      <div className="flex flex-col gap-4 p-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Briefcase className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-foreground font-medium text-sm leading-tight">{styleName}</h3>
            <p className="text-muted-foreground text-[11px]">Active Style</p>
          </div>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-secondary/80 text-secondary-foreground border-0 text-[10px] px-2 py-0.5 font-normal"
            >
              <Hash className="h-2.5 w-2.5 mr-0.5" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-3 p-4 border-b border-border">
        <p className="text-foreground text-xs font-medium">Session Stats</p>
        <div className="flex flex-col gap-2">
          {[
            { icon: BarChart3, label: "Messages", value: "0" },
            { icon: Clock, label: "Duration", value: "0m" },
            { icon: Star, label: "Saved", value: "0" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stat.icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground text-xs">{stat.label}</span>
              </div>
              <span className="text-foreground text-xs font-medium">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-col gap-2 p-4">
        <p className="text-foreground text-xs font-medium mb-1">Quick Prompts</p>
        {[
          "Write an intro paragraph",
          "Rewrite for clarity",
          "Make it more concise",
          "Add a strong CTA",
          "Change tone to casual",
        ].map((prompt) => (
          <button
            key={prompt}
            type="button"
            className="text-left text-muted-foreground hover:text-foreground text-xs px-2.5 py-2 rounded-lg hover:bg-secondary/50 transition-colors leading-relaxed"
          >
            {prompt}
          </button>
        ))}
      </div>
    </aside>
  )
}
