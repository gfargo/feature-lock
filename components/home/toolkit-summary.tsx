"use client"

import Link from "next/link"
import { track } from "@vercel/analytics"
import { Button } from "@/components/ui/button"

const TOOLKIT_CARDS = [
  {
    title: "BlurWrapper",
    description: "Blur locked content, manage focus, and run async upgrade flows with accessible defaults.",
    href: "/docs#blurwrapper",
    trackId: "home_summary_blurwrapper_docs_clicked",
  },
  {
    title: "PaywallBanner",
    description: "Announce launches or quota limits with dismissible messaging that respects user intent.",
    href: "/docs#paywall-banner",
    trackId: "home_summary_paywall_docs_clicked",
  },
  {
    title: "FeatureTooltip",
    description: "Offer subtle inline upsells for disabled actions, icons, or table cells with async CTAs.",
    href: "/docs#feature-tooltip",
    trackId: "home_summary_tooltip_docs_clicked",
  },
  {
    title: "UpgradeModal",
    description: "Compare plans in-place with responsive cards, async buttons, and enterprise contact paths.",
    href: "/docs#upgrade-modal",
    trackId: "home_summary_modal_docs_clicked",
  },
  {
    title: "UsageProgress",
    description: "Visualize quotas, warn before limits, and funnel users toward the right upgrade flow.",
    href: "/docs#usage-progress",
    trackId: "home_summary_usage_docs_clicked",
  },
]

export function ToolkitSummary() {
  return (
    <section className="space-y-6 rounded-2xl border border-primary/10 bg-card/60 p-8 backdrop-blur-sm">
      <div className="space-y-2 text-center md:text-left">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Meet the toolkit
        </h2>
        <p className="text-sm text-muted-foreground md:text-base">
          Install only what you need—or compose the full suite for a complete monetization experience.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {TOOLKIT_CARDS.map((card) => (
          <article key={card.title} className="rounded-2xl border border-primary/15 bg-card/80 p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
            <Link href={card.href}>
              <Button
                variant="ghost"
                className="mt-4 px-2.5 text-primary hover:text-primary/80"
                onClick={() => track(card.trackId)}
              >
                View docs
              </Button>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
