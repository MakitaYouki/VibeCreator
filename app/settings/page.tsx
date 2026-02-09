import { DashboardSidebar } from '@/components/dashboard-sidebar'
import { DashboardHeader } from '@/components/dashboard-header'
import { ThemeToggle } from '@/components/theme-toggle'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 md:px-6">
              <section className="max-w-xl rounded-xl border border-border bg-card p-6 shadow-sm">
                <h1 className="text-lg font-semibold text-foreground">
                  Settings
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Personalize your VibeCreator workspace.
                </p>
                <div className="mt-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Theme
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Switch between light and dark mode.
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

