import { Layers, PenTool, TrendingUp, Clock } from "lucide-react"

const stats = [
  { label: "Total Styles", value: "9", icon: Layers },
  { label: "Content Created", value: "1,854", icon: PenTool },
  { label: "This Week", value: "+47", icon: TrendingUp },
  { label: "Last Used", value: "2h ago", icon: Clock },
]

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-foreground font-semibold text-sm leading-none">{stat.value}</p>
            <p className="text-muted-foreground text-[11px] mt-0.5">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
