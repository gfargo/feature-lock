"use client"

import Link from "next/link"
import { track } from "@vercel/analytics"
import { UsageProgress } from "@/components/usageProgress/usage-progress"
import { Button } from "@/components/ui/button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const USAGE_TRACKS = [
  {
    label: "API requests",
    value: 92_300,
    limit: 100_000,
    status: "warning" as const,
    badge: "92% used",
    description: "Scale plan adds 500k requests / month",
    trend: "up" as const,
  },
  {
    label: "Workspace seats",
    value: 28,
    limit: 30,
    status: "critical" as const,
    badge: "2 remaining",
    trend: "steady" as const,
  },
  {
    label: "Scheduled exports",
    value: 12,
    limit: 20,
    status: "ok" as const,
    badge: "60% used",
    trend: "down" as const,
  },
]

export function UsageProgressSection() {
  const handleUpgrade = async () => {
    track("home_usage_upgrade_clicked")
    await wait(900)
    track("home_usage_upgrade_completed")
  }

  return (
    <section className="space-y-6 rounded-2xl border border-primary/10 bg-card/50 p-8 backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            UsageProgress · Keep quotas healthy
          </h2>
          <p className="text-muted-foreground">
            Show customers where they stand, warn before they hit limits, and highlight the value of upgrading.
          </p>
        </div>
        <Link href="/docs#usage-progress">
          <Button
            variant="ghost"
            size="sm"
            className="self-start md:self-auto"
            onClick={() => track("home_usage_docs_clicked")}
          >
            View docs
          </Button>
        </Link>
      </div>

      <UsageProgress
        tracks={USAGE_TRACKS}
        summaryValue="Scale plan unlocks 500k requests & 100 seats"
        summaryMessage="Never hit a quota surprise. Unlock higher limits and priority support."
        ctaLabel="Upgrade usage"
        onCtaClick={handleUpgrade}
        secondaryLabel="Contact sales"
        onSecondaryClick={() => {
          track("home_usage_contact_sales")
          window.open("mailto:sales@feature-lock.dev", "_blank")
        }}
        note="Quotas reset on May 1. Upgrading keeps existing data intact."
        footer={
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>Need custom limits?</span>
            <a
              href="https://feature-lock.griffen.codes/contact"
              className="text-primary hover:text-primary/80 underline underline-offset-4"
              onClick={() => track("home_usage_footer_contact")}
            >
              Talk to sales
            </a>
          </div>
        }
      />
    </section>
  )
}
