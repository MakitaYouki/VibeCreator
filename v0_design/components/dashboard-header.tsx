"use client"

import { Plus, Search, Sparkles, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function DashboardHeader() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="flex items-center justify-between h-16 px-4 md:px-6 border-b border-border bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <button type="button" className="md:hidden text-muted-foreground hover:text-foreground transition-colors">
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-foreground font-semibold text-sm">StyleForge</span>
        </div>
        <div className="hidden md:block">
          <h1 className="text-foreground font-semibold text-base">Writing Styles</h1>
          <p className="text-muted-foreground text-xs">Manage your AI writing personas</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {searchOpen ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search styles..."
              autoFocus
              onBlur={() => setSearchOpen(false)}
              className="h-9 w-48 md:w-64 rounded-lg border border-border bg-secondary/50 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            className="text-muted-foreground hover:text-foreground h-9 w-9"
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Search styles</span>
          </Button>
        )}
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 gap-1.5 text-sm font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Create New Style</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
    </header>
  )
}
