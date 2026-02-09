"use client"

import React from "react"

import { ArrowRight, MoreHorizontal, Copy, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export interface StyleCardProps {
  title: string
  description: string
  tags: string[]
  icon: React.ReactNode
  uses: number
  gradientFrom: string
  gradientTo: string
}

export function StyleCard({
  title,
  description,
  tags,
  icon,
  uses,
  gradientFrom,
  gradientTo,
}: StyleCardProps) {
  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden">
      {/* Subtle gradient accent at top */}
      <div
        className="h-[2px] w-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        }}
      />

      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Top row: Icon + Title + Menu */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${gradientFrom}15, ${gradientTo}15)`,
              }}
            >
              <span
                className="text-sm"
                style={{
                  color: gradientFrom,
                }}
              >
                {icon}
              </span>
            </div>
            <div>
              <h3 className="text-foreground font-medium text-sm leading-tight">{title}</h3>
              <span className="text-muted-foreground text-xs">{uses} uses</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only">Style options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 bg-card border-border">
              <DropdownMenuItem className="text-foreground text-xs gap-2 cursor-pointer">
                <Pencil className="h-3 w-3" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-foreground text-xs gap-2 cursor-pointer">
                <Copy className="h-3 w-3" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive text-xs gap-2 cursor-pointer">
                <Trash2 className="h-3 w-3" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-secondary/80 text-secondary-foreground border-0 text-[10px] px-2 py-0.5 font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Write Button */}
        <div className="pt-1 mt-auto">
          <Button
            size="sm"
            variant="ghost"
            className="w-full h-8 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary gap-1.5 group/btn"
          >
            Write with this style
            <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
