import { Layers, PenTool, TrendingUp, Clock } from "lucide-react"

type StatsBarProps = {
  totalStyles: number
}

export function StatsBar({ totalStyles }: StatsBarProps) {
  const stats = [
    { label: "Total Styles", value: String(totalStyles), icon: Layers },
    { label: "Content Created", value: "—", icon: PenTool },
    { label: "This Week", value: "—", icon: TrendingUp },
    { label: "Last Used", value: "—", icon: Clock },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3 shadow-sm"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
            <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold leading-none">
              {stat.value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

