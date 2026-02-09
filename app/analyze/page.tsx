'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { runScriptAnalysis } from '@/app/actions/analyze'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { Button } from '@/components/ui/button'

export default function AnalyzePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const script = (form.elements.namedItem('script') as HTMLTextAreaElement).value?.trim()
    if (!script) {
      setError('Please paste a script to analyze.')
      return
    }
    setLoading(true)
    try {
      const result = await runScriptAnalysis(script)
      if (result.success) {
        router.push('/test-db')
        router.refresh()
        return
      }
      setError(result.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 md:px-6">
              <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-base font-semibold text-foreground">
                      Script analysis
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      Paste any script to generate a reusable writing style.
                    </p>
                  </div>
                  <Link
                    href="/test-db"
                    className="text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    View styles
                  </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="script"
                      className="block text-sm font-medium text-foreground"
                    >
                      Paste your script
                    </label>
                    <textarea
                      id="script"
                      name="script"
                      rows={14}
                      placeholder="Paste the script you want to analyze here..."
                      disabled={loading}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <Link
                      href="/"
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      ← Back to home
                    </Link>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Analyzing…' : 'Start analysis'}
                    </Button>
                  </div>
                </form>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
