import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import CreateChat from './CreateChat'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { StylesGrid } from '@/components/styles-grid'

type Props = { searchParams: Promise<{ style?: string }> }

export default async function CreatePage({ searchParams }: Props) {
  const { style: styleId } = await searchParams

  const renderShell = (content: React.ReactNode) => (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 md:px-6">
              {content}
            </div>
          </main>
        </div>
      </div>
    </div>
  )

  const supabase = await createClient()
  const { data: styles, error: listError } = await supabase
    .from('styles')
    .select('id, name, description, config_json')
    .order('created_at', { ascending: false })

  const safeStyles = styles ?? []

  if (!styleId) {
    return renderShell(
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-base font-semibold text-foreground">
              Creation
            </h1>
            <p className="text-xs text-muted-foreground">
              Choose a style to start writing with VibeCreator.
            </p>
          </div>
        </header>

        {listError && (
          <p className="text-sm text-red-600">
            Failed to load styles: {listError.message}
          </p>
        )}

        {!listError && safeStyles.length === 0 && (
          <div className="rounded-lg border border-dashed border-border bg-background px-4 py-6 text-center text-sm text-muted-foreground">
            You don&apos;t have any styles yet.{" "}
            <Link
              href="/analyze"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create your first style
            </Link>{" "}
            by analyzing a script.
          </div>
        )}

        {!listError && safeStyles.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Select a style to begin:
            </p>
            <StylesGrid styles={safeStyles as any} showCreateCard={false} />
          </div>
        )}
      </section>,
    )
  }

  const { data: style, error } = await supabase
    .from('styles')
    .select('id, name, description, config_json')
    .eq('id', styleId)
    .single()

  if (error || !style) {
    return renderShell(
      <section className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="mb-2 text-xl font-semibold text-foreground">
          Style not found
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {error?.message || 'This style may have been removed.'}
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          Back to home
        </Link>
      </section>,
    )
  }

  const config = (style.config_json as Record<string, unknown>) ?? {}
  const styleName = style.name?.trim() || `Unnamed Style - ${String(style.id).slice(0, 8)}`

  return renderShell(
    <CreateChat
      styleId={String(style.id)}
      styleName={styleName}
      styleConfig={config}
    />,
  )
}
