"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
  styleId: string
  title: string
  description: string
  tags: string[]
  icon: React.ReactNode
  uses: number
  gradientFrom: string
  gradientTo: string
}

export function StyleCard({
  styleId,
  title,
  description,
  tags,
  icon,
  uses,
  gradientFrom,
  gradientTo,
}: StyleCardProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [localHidden, setLocalHidden] = useState(false)

  async function handleDelete() {
    const ok = window.confirm(
      "Delete this style? This cannot be undone.",
    )
    if (!ok) return

    setLocalHidden(true)
    try {
      const res = await fetch(`/api/styles/${encodeURIComponent(styleId)}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        setLocalHidden(false)
        const data = await res.json().catch(() => ({}))
        alert(data.error || "Failed to delete style.")
        return
      }
      startTransition(() => {
        router.refresh()
      })
    } catch (err) {
      console.error(err)
      setLocalHidden(false)
      alert("Failed to delete style.")
    }
  }

  if (localHidden) return null

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md">
      {/* Subtle gradient accent at top */}
      <div
        className="h-[2px] w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
        }}
      />

      <div className="flex flex-1 flex-col gap-3 p-4">
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
              <h3 className="text-sm font-medium leading-tight text-foreground">
                {title}
              </h3>
              <span className="text-xs text-muted-foreground">
                {uses > 0 ? `${uses} uses` : "New style"}
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only">Style options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-36 border-border bg-card"
            >
              <DropdownMenuItem className="flex cursor-pointer gap-2 text-xs text-foreground">
                <Pencil className="h-3 w-3" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer gap-2 text-xs text-foreground">
                <Copy className="h-3 w-3" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer gap-2 text-xs text-destructive"
                onClick={handleDelete}
                disabled={pending}
              >
                <Trash2 className="h-3 w-3" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Description */}
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="border-0 bg-secondary/80 px-2 py-0.5 text-[10px] font-normal text-secondary-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Write Button */}
        <div className="mt-auto pt-1">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="group/btn h-8 w-full gap-1.5 bg-secondary/50 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <Link href={`/create?style=${encodeURIComponent(styleId)}`}>
              Write with this style
              <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

