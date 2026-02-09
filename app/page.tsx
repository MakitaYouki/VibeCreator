import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { StatsBar } from '@/components/stats-bar'
import { StylesGrid } from '@/components/styles-grid'

export default async function Home() {
  const supabase = await createClient()
  const { data: styles, error } = await supabase
    .from('styles')
    .select('*')
    .order('created_at', { ascending: false })

  const safeStyles = styles ?? []

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:px-6">
              {/* Mobile title */}
              <div className="md:hidden">
                <h1 className="text-sm font-semibold text-foreground">
                  Writing Styles
                </h1>
                <p className="text-xs text-muted-foreground">
                  Manage your AI writing personas
                </p>
              </div>

              <StatsBar totalStyles={safeStyles.length} />

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
                  Failed to load styles: {error.message}
                </div>
              )}

              {!error && safeStyles.length === 0 && (
                <section className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
                  <h2 className="mb-2 text-base font-semibold text-foreground">
                    No styles yet
                  </h2>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Analyze a script to create your first writing style persona.
                  </p>
                  <Link
                    href="/analyze"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
                  >
                    Analyze script
                  </Link>
                </section>
              )}

              {!error && safeStyles.length > 0 && (
                <StylesGrid styles={safeStyles as any} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
