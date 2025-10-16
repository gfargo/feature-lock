"use client"

import * as React from "react"
import Link from "next/link"
import { track } from "@vercel/analytics"
import { UpgradeModal } from "@/components/upgradeModal/upgrade-modal"
import { Button } from "@/components/ui/button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

type Plan = {
  id: string
  name: string
  description: string
  price: string
  period?: string
  badge?: string
  recommended?: boolean
  highlight?: string
  features: Array<string | { label: string; footnote?: string }>
  ctaLabel: string
  ctaHref?: string
}

const PLANS: Plan[] = [
  {
    id: "growth",
    name: "Growth",
    description: "Unlock team-wide automation, analytics, and quota extensions.",
    price: "$79",
    period: "month",
    highlight: "Everything in Starter, plus",
    features: [
      "Unlimited dashboards",
      "Team benchmarks & leaderboards",
      { label: "Priority support", footnote: "Responses within 1 business day" },
    ],
    ctaLabel: "Upgrade to Growth",
  },
  {
    id: "scale",
    name: "Scale",
    description: "AI forecasts, role-based permissions, and guided onboarding.",
    price: "$129",
    period: "month",
    badge: "Most popular",
    recommended: true,
    highlight: "Built for rapidly scaling product teams",
    features: [
      "AI churn & expansion forecasts",
      { label: "Advanced roles & permissions", footnote: "Segment access by workspace" },
      "Dedicated onboarding manager",
    ],
    ctaLabel: "Talk to sales",
    ctaHref: "https://feature-lock.griffen.codes/contact",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom security reviews, data residency options, and success planning.",
    price: "Custom",
    highlight: "Tailored deployment with white-glove support",
    features: [
      "SOC2 reports & security reviews",
      { label: "Customer success workshops", footnote: "Quarterly roadmap reviews" },
      "On-prem & regional data residency",
    ],
    ctaLabel: "Request enterprise demo",
  },
]

export function UpgradeModalSection() {
  const [open, setOpen] = React.useState(false)

  const handlePlanSelect = async (planId: string) => {
    track("home_upgrade_modal_plan_checkout_started", { planId })
    await wait(900)
    track("home_upgrade_modal_plan_checkout_completed", { planId })
  }

  return (
    <section className="space-y-6 rounded-2xl border border-primary/10 bg-card/50 p-8 backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            UpgradeModal · Compare plans without leaving the page
          </h2>
          <p className="text-muted-foreground">
            Show plan comparisons with responsive cards, async buttons, enterprise contact paths, and more.
          </p>
        </div>
        <Link href="/docs#upgrade-modal">
          <Button
            variant="ghost"
            size="sm"
            className="self-start md:self-auto"
            onClick={() => track("home_upgrade_modal_docs_clicked")}
          >
            View docs
          </Button>
        </Link>
      </div>

      <UpgradeModal
        trigger={
          <Button
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => track("home_upgrade_modal_trigger_clicked")}
          >
            View plans
          </Button>
        }
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          track(next ? "home_upgrade_modal_opened" : "home_upgrade_modal_closed")
        }}
        subtitle="Scale your monetization strategy"
        finePrint="Prices shown in USD. Cancel anytime during the billing cycle."
        supportEmail="sales@feature-lock.dev"
        onPlanSelected={(planId) => track("home_upgrade_modal_plan_selected", { planId })}
        plans={PLANS.map((plan) => ({
          ...plan,
          onSelect: plan.ctaHref
            ? async () => {
                track("home_upgrade_modal_plan_checkout_started", { planId: plan.id })
                window.open(plan.ctaHref!, "_blank", "noopener,noreferrer")
                track("home_upgrade_modal_plan_checkout_completed", { planId: plan.id })
              }
            : async () => {
                await handlePlanSelect(plan.id)
              },
        }))}
      />
    </section>
  )
}
