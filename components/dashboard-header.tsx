"use client"

import Link from "next/link"
import { Plus, Search, Sparkles, Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/30 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-muted-foreground transition-colors hover:text-foreground md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">VibeCreator</span>
        </div>
        <div className="hidden md:block">
          <h1 className="text-base font-semibold text-foreground">Styles</h1>
          <p className="text-xs text-muted-foreground">
            Manage your AI writing personas
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {searchOpen ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search styles..."
              autoFocus
              onBlur={() => setSearchOpen(false)}
              className="h-9 w-48 rounded-lg border border-border bg-secondary/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 md:w-64"
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search styles</span>
          </Button>
        )}
        <Button
          asChild
          size="sm"
          className="h-9 gap-1.5 bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/analyze">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Create New Style</span>
            <span className="sm:hidden">New</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}

