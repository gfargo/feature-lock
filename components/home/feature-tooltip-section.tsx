"use client"

import * as React from "react"
import Link from "next/link"
import { track } from "@vercel/analytics"
import type { LucideIcon } from "lucide-react"
import { Sparkles, BarChart3, Crown, ArrowRight } from "lucide-react"
import { FeatureTooltip } from "@/components/featureTooltip/feature-tooltip"
import { Button } from "@/components/ui/button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type TooltipItem = {
  id: string
  title: string
  description: string
  badge: string
  highlights: string[]
  icon: LucideIcon
  triggerLabel: string
  ctaHref?: string
}

const TOOLTIP_ITEMS: TooltipItem[] = [
  {
    id: "ai-forecasts",
    title: "AI Forecasts",
    description: "Predict churn before it happens with daily health scoring.",
    badge: "Pro",
    highlights: ["Daily signal refresh", "Scenario planning", "CSV exports"],
    icon: Sparkles,
    triggerLabel: "AI forecasts (Pro)",
  },
  {
    id: "team-benchmarks",
    title: "Team Benchmarks",
    description: "Compare squads and identify top performers instantly.",
    badge: "Growth",
    highlights: ["Weekly goal tracking", "Drill-down by role"],
    icon: BarChart3,
    triggerLabel: "Team benchmarks",
  },
  {
    id: "executive-dash",
    title: "Executive dashboard",
    description: "Aggregate KPIs, alerts, and runway forecasting in one view.",
    badge: "Enterprise",
    highlights: ["Unlimited dashboards", "Scheduled email digests"],
    icon: Crown,
    triggerLabel: "Executive dashboard",
    ctaHref: "https://feature-lock.griffen.codes/contact",
  },
]

export function FeatureTooltipSection() {
  const handleUpgrade = React.useCallback(async (featureId: string) => {
    track("home_tooltip_upgrade_clicked", { feature: featureId })
    await wait(1000)
    track("home_tooltip_upgrade_completed", { feature: featureId })
  }, [])

  return (
    <section className="space-y-6 rounded-2xl border border-primary/10 bg-card/50 p-8 backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            FeatureTooltip · Inline nudges
          </h2>
          <p className="text-muted-foreground">
            Keep upgrade messaging lightweight for buttons, table cells, icons, and other micro-surfaces.
          </p>
        </div>
        <Link href="/docs#feature-tooltip">
          <Button
            variant="ghost"
            size="sm"
            className="self-start md:self-auto"
            onClick={() => track("home_feature_tooltip_docs_clicked")}
          >
            View docs
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {TOOLTIP_ITEMS.map((item) => {
          const TriggerIcon = item.icon
          return (
            <FeatureTooltip
              key={item.id}
              title={item.title}
              description={item.description}
              badge={item.badge}
              icon={item.icon}
              highlights={item.highlights}
              ctaLabel={item.ctaHref ? "Contact sales" : "Upgrade now"}
              ctaHref={item.ctaHref}
              onCtaClick={item.ctaHref ? undefined : () => handleUpgrade(item.id)}
              onOpenChange={(open) => {
                if (open) track("home_tooltip_opened", { feature: item.id })
              }}
              className="w-full"
              contentClassName="bg-background/98"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-primary/20 bg-background/40 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-background/80 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span className="flex items-center gap-2">
                  <TriggerIcon className="size-4" aria-hidden="true" />
        {item.triggerLabel}
      </span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </FeatureTooltip>
          )
        })}
      </div>
    </section>
  )
}
