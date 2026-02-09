import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsBar } from "@/components/stats-bar"
import { StylesGrid } from "@/components/styles-grid"

export default function Page() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">
            {/* Mobile Title */}
            <div className="md:hidden">
              <h1 className="text-foreground font-semibold text-lg">Writing Styles</h1>
              <p className="text-muted-foreground text-xs">Manage your AI writing personas</p>
            </div>
            <StatsBar />
            <StylesGrid />
          </div>
        </main>
      </div>
    </div>
  )
}
