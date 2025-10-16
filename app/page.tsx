"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { track } from "@vercel/analytics"
import BlurWrapper from "@/components/blurWrapper/blur-wrapper"
import { PaywallBanner } from "@/components/paywallBanner/paywall-banner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2, Lock, ArrowRight, Sparkles, BookOpen, BarChart3, Crown, Gauge } from "lucide-react"
import { cn } from "@/lib/utils"
import { FeatureTooltip } from "@/components/featureTooltip/feature-tooltip"
import { UpgradeModal } from "@/components/upgradeModal/upgrade-modal"
import { UsageProgress } from "@/components/usageProgress/usage-progress"

export default function Page() {
  const router = useRouter()
  const [bannerOpen, setBannerOpen] = React.useState(true)
  const [upgradeModalOpen, setUpgradeModalOpen] = React.useState(false)
  const [analyticsBlurred, setAnalyticsBlurred] = React.useState(true)
  const [billingBlurred, setBillingBlurred] = React.useState(true)
  const [reportsBlurred, setReportsBlurred] = React.useState(true)
  const allBlurred = analyticsBlurred && billingBlurred && reportsBlurred

  // Track demo interactions
  const handleToggleAll = (checked: boolean) => {
    setAnalyticsBlurred(checked)
    setBillingBlurred(checked)
    setReportsBlurred(checked)
    track("demo_toggle_all", { blurred: checked })
  }

  const handleSectionUnlock = (section: string) => {
    track("demo_section_unlocked", { section })
  }

  // Fake APIs
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
  const fakeUpgradeOk = async () => {
    await wait(2000)
  }
  const fakeUpgradeSometimes = async () => {
    await wait(1200)
    if (Math.random() < 0.6) throw new Error("Payment authorization failed. Please try again.")
  }
  const handleBannerInstall = async () => {
    track("home_banner_install_clicked")
    await wait(900)
    track("home_banner_install_completed")
  }
  const handleBannerReset = () => {
    setBannerOpen(true)
    track("home_banner_reset")
  }
  const handleTooltipUpgrade = async (feature: string) => {
    track("home_tooltip_upgrade_clicked", { feature })
    await wait(1000)
    track("home_tooltip_upgrade_completed", { feature })
  }
  const handleUsageUpgrade = async () => {
    track("home_usage_upgrade_clicked")
    await wait(900)
    track("home_usage_upgrade_completed")
  }

  // Track page view
  React.useEffect(() => {
    track("home_viewed")
  }, [])

  const tooltipItems = [
    {
      id: "ai-forecasts",
      title: "AI Forecasts",
      description: "Predict churn before it happens with daily health scoring.",
      badge: "Pro",
      highlights: ["Daily signal refresh", "Scenario planning", "CSV exports"],
      icon: Sparkles,
      ctaLabel: "Start trial",
      onCtaClick: () => handleTooltipUpgrade("ai-forecasts"),
      triggerLabel: "AI forecasts (Pro)",
      TriggerIcon: Sparkles,
    },
    {
      id: "team-benchmarks",
      title: "Team Benchmarks",
      description: "Compare squads and identify top performers instantly.",
      badge: "Growth",
      highlights: ["Weekly goal tracking", "Drill-down by role"],
      icon: BarChart3,
      ctaLabel: "Upgrade team",
      onCtaClick: () => handleTooltipUpgrade("team-benchmarks"),
      triggerLabel: "Team benchmarks",
      TriggerIcon: BarChart3,
    },
    {
      id: "executive-dash",
      title: "Executive dashboard",
      description: "Aggregate KPIs, alerts, and runway forecasting in one view.",
      badge: "Enterprise",
      highlights: ["Unlimited dashboards", "Scheduled email digests"],
      icon: Crown,
      ctaLabel: "Talk to sales",
      ctaHref: "https://feature-lock.griffen.codes/contact",
      onOpenChange: (open: boolean) => {
        if (open) track("home_tooltip_opened", { feature: "executive-dash" })
      },
      triggerLabel: "Executive dashboard",
      TriggerIcon: Gauge,
    },
  ] as const

  const upgradePlans = [
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
      ctaPendingLabel: "Launching checkout...",
      onSelect: async () => {
        track("home_upgrade_modal_plan_checkout_started", { planId: "growth" })
        await fakeUpgradeSometimes()
        track("home_upgrade_modal_plan_checkout_completed", { planId: "growth" })
      },
      onSelectError: (error) => {
        track("home_upgrade_modal_plan_checkout_failed", {
          planId: "growth",
          message: error instanceof Error ? error.message : String(error),
        })
      },
    },
    {
      id: "scale",
      name: "Scale",
      badge: "Most popular",
      recommended: true,
      description: "AI forecasts, role-based permissions, and guided onboarding.",
      price: "$129",
      period: "month",
      highlight: "Built for rapidly scaling product teams",
      features: [
        "AI churn & expansion forecasts",
        { label: "Advanced roles & permissions", footnote: "Segment access by workspace" },
        "Dedicated onboarding manager",
      ],
      ctaLabel: "Talk to sales",
      ctaHref: "https://feature-lock.griffen.codes/contact",
      onSelect: async () => {
        track("home_upgrade_modal_plan_checkout_started", { planId: "scale" })
        await wait(900)
        track("home_upgrade_modal_plan_checkout_completed", { planId: "scale" })
        window.open("https://feature-lock.griffen.codes/contact", "_blank", "noopener,noreferrer")
      },
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
      ctaPendingLabel: "Scheduling...",
      onSelect: async () => {
        track("home_upgrade_modal_plan_checkout_started", { planId: "enterprise" })
        await wait(1200)
        track("home_upgrade_modal_plan_checkout_completed", { planId: "enterprise" })
      },
    },
  ] as const

  const usageTracks = [
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

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="p-8 pb-20 gap-16 sm:p-20">
        <main className="mx-auto max-w-7xl space-y-16">
          {/* Hero */}
          <header className="relative text-center space-y-6">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-3xl blur-3xl" />

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium mb-4">
              <Sparkles className="size-4" />
              <span>Unlock features with elegant UX</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
              Feature Lock
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              A suite of upgrade-ready UI building blocks—BlurWrapper, PaywallBanner, FeatureTooltip, and UpgradeModal—to
              convert users without disrupting their flow.
            </p>

            <div className="flex flex-wrap justify-center gap-2 text-xs font-medium text-primary">
              {["BlurWrapper", "PaywallBanner", "FeatureTooltip", "UpgradeModal", "UsageProgress"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary"
                >
                  {label}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 justify-center items-center pt-4">
              <Link href="/docs">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground group"
                  onClick={() => track("hero_docs_clicked")}
                >
                  <BookOpen className="mr-2 size-4" />
                  Documentation
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {/* Story link removed per request */}
              <a href="https://github.com/gfargo/feature-lock" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5 bg-transparent"
                  onClick={() => track("hero_github_clicked")}
                >
                  View on GitHub
                </Button>
              </a>
            </div>
          </header>

          <section className="border-2 border-primary/10 rounded-2xl p-8 bg-card/60 backdrop-blur-sm space-y-6">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Meet the toolkit
              </h2>
              <p className="text-muted-foreground">
                Install only what you need—or compose all four components for a complete upgrade experience.
              </p>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <div className="rounded-2xl border border-primary/15 bg-card/80 p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">BlurWrapper</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Blur locked content, run async upgrade flows, and keep focus management accessible.
                </p>
                <Link href="/docs#blurwrapper">
                  <Button variant="ghost" className="mt-4 px-0 text-primary hover:text-primary/80" onClick={() => track("home_summary_blurwrapper_docs_clicked")}>
                    View docs
                  </Button>
                </Link>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-card/80 p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">PaywallBanner</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Announce launches or quota alerts with dismissible messaging that respects user intent.
                </p>
                <Link href="/docs#paywall-banner">
                  <Button variant="ghost" className="mt-4 px-0 text-primary hover:text-primary/80" onClick={() => track("home_summary_paywall_docs_clicked")}>
                    View docs
                  </Button>
                </Link>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-card/80 p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">FeatureTooltip</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Offer subtle inline upsells for disabled actions, icons, or tables with async CTA support.
                </p>
                <Link href="/docs#feature-tooltip">
                  <Button variant="ghost" className="mt-4 px-0 text-primary hover:text-primary/80" onClick={() => track("home_summary_tooltip_docs_clicked")}>
                    View docs
                  </Button>
                </Link>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-card/80 p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">UpgradeModal</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Compare plans in-place with responsive cards, async buttons, and enterprise contact paths.
                </p>
                <Link href="/docs#upgrade-modal">
                  <Button variant="ghost" className="mt-4 px-0 text-primary hover:text-primary/80" onClick={() => track("home_summary_modal_docs_clicked")}>
                    View docs
                  </Button>
                </Link>
              </div>
              <div className="rounded-2xl border border-primary/15 bg-card/80 p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">UsageProgress</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Visualize quotas, warn before limits, and funnel users toward the right upgrade flow.
                </p>
                <Link href="/docs#usage-progress">
                  <Button variant="ghost" className="mt-4 px-0 text-primary hover:text-primary/80" onClick={() => track("home_summary_usage_docs_clicked")}>
                    View docs
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="border-2 border-primary/10 rounded-2xl p-8 bg-card/60 backdrop-blur-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                  PaywallBanner · Announce features without hard paywalls
                </h2>
                <p className="text-muted-foreground">
                  PaywallBanner helps you highlight launches and upgrades while letting users dismiss messaging when
                  they are not ready yet.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBannerReset}
                disabled={bannerOpen}
                className="self-start md:self-auto"
              >
                Reset banner
              </Button>
            </div>

            <PaywallBanner
              open={bannerOpen}
              onOpenChange={setBannerOpen}
              badge="New component"
              title="PaywallBanner is now in the registry"
              description="Install the dismissible announcement banner to highlight launches, quota warnings, and upgrade paths across your product."
              ctaLabel="Install instantly"
              ctaPendingLabel="Copying command..."
              onCtaClick={handleBannerInstall}
              onCtaSuccess={() => track("home_banner_install_success")}
              onCtaError={() => track("home_banner_install_error")}
              secondaryLabel="View docs"
              onSecondaryClick={() => {
                track("home_banner_docs_clicked")
                router.push("/docs#paywall-banner")
              }}
              onDismiss={() => {
                track("home_banner_dismissed")
              }}
              showDivider
            >
              <ul className="list-disc pl-4 space-y-1">
                <li>Persist dismissals with <code>storageKey</code> when you re-launch the banner.</li>
                <li>Run async upgrade flows with built-in pending and error states.</li>
              </ul>
            </PaywallBanner>
          </section>

          {/* BlurWrapper Demo */}
          <section className="border-2 border-primary/10 rounded-2xl p-8 bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                  BlurWrapper · Interactive demo
                </h2>
                <p className="text-muted-foreground">
                  Toggle sections to see blur effects, dialogs, and inline overlays in action
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="blur-toggle"
                  checked={allBlurred}
                  onCheckedChange={handleToggleAll}
                  aria-label="Toggle blur"
                />
                <Label htmlFor="blur-toggle" className="cursor-pointer font-medium">
                  Blur all sections
                </Label>
              </div>
            </div>
          </section>

          {/* FeatureTooltip */}
          <section className="border-2 border-primary/10 rounded-2xl p-8 bg-card/50 backdrop-blur-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                  FeatureTooltip · Inline nudges
                </h2>
                <p className="text-muted-foreground">
                  FeatureTooltip keeps upgrade messaging lightweight for buttons, table cells, and icons.
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
              {tooltipItems.map((item) => {
                const TriggerIcon = item.TriggerIcon
                return (
                  <FeatureTooltip
                    key={item.id}
                    title={item.title}
                    description={item.description}
                    badge={item.badge}
                    icon={item.icon}
                    highlights={item.highlights}
                    ctaLabel={item.ctaLabel}
                    ctaHref={item.ctaHref}
                    onCtaClick={item.onCtaClick}
                    onOpenChange={(open) => {
                      if (open) {
                        track("home_tooltip_opened", { feature: item.id })
                      }
                      item.onOpenChange?.(open)
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

          {/* Upgrade Modal */}
          <section className="border-2 border-primary/10 rounded-2xl p-8 bg-card/50 backdrop-blur-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                  Compare plans without leaving the page
                </h2>
                <p className="text-muted-foreground">
                  UpgradeModal packs a full pricing comparison into a single, focused dialog.
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
                  onClick={() => {
                    track("home_upgrade_modal_trigger_clicked")
                  }}
                >
                  View plans
                </Button>
              }
              open={upgradeModalOpen}
              onOpenChange={(next) => {
                setUpgradeModalOpen(next)
                track(next ? "home_upgrade_modal_opened" : "home_upgrade_modal_closed")
              }}
              subtitle="Scale your monetization strategy"
              finePrint="Prices shown in USD. Cancel anytime during the billing cycle."
              supportEmail="sales@feature-lock.dev"
              onPlanSelected={(planId) => track("home_upgrade_modal_plan_selected", { planId })}
              plans={upgradePlans}
            />
          </section>

          {/* Usage Progress */}
          <section className="border-2 border-primary/10 rounded-2xl p-8 bg-card/50 backdrop-blur-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
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
              tracks={usageTracks}
              summaryValue="Scale plan unlocks 500k requests & 100 seats"
              summaryMessage="Never hit a quota surprise. Unlock higher limits and priority support."
              ctaLabel="Upgrade usage"
              onCtaClick={handleUsageUpgrade}
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

          {/* Demo Cards */}
          <section className="grid gap-6 lg:grid-cols-3">
            {/* 1) Dialog overlay with default content */}
            <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Analytics</CardTitle>
                  <CardDescription>Trends, breakdowns, exports</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "transition-colors",
                    analyticsBlurred
                      ? "border-primary/30 text-primary bg-primary/5"
                      : "border-primary/20 text-muted-foreground",
                  )}
                >
                  {analyticsBlurred ? "Locked" : "Active"}
                </Badge>
              </CardHeader>
              <CardContent>
                <BlurWrapper
                  isBlurred={analyticsBlurred}
                  blurIntensity="md"
                  dimOpacity={0.6}
                  disablePointerEvents
                  focusInert
                  announcePending
                  focusErrorOnSet
                  dialogTitle="Feature locked"
                  dialogDescription="Upgrade or contact your admin to request access."
                  confirmLabel="Upgrade now"
                  pendingLabel="Upgrading..."
                  onConfirm={fakeUpgradeOk}
                  onUnblur={() => {
                    setAnalyticsBlurred(false)
                    handleSectionUnlock("analytics")
                  }}
                >
                  <div className="grid gap-4">
                    <div className="rounded-lg border border-primary/10 p-4 bg-primary/5">
                      <p className="text-xs text-muted-foreground">Last 7 days</p>
                      <p className="text-2xl font-semibold mt-1">12,941</p>
                      <div className="mt-3 h-24 rounded-md bg-primary/10" />
                    </div>
                    <div className="rounded-lg border border-primary/10 p-4 bg-primary/5">
                      <p className="text-xs text-muted-foreground">Conversion rate</p>
                      <p className="text-2xl font-semibold mt-1">3.7%</p>
                      <div className="mt-3 h-24 rounded-md bg-primary/10" />
                    </div>
                  </div>
                </BlurWrapper>
              </CardContent>
            </Card>

            {/* 2) Inline overlay centered with custom overlay + error focus */}
            <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Billing Settings</CardTitle>
                <CardDescription>Payment method & invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <BlurWrapper
                  isBlurred={billingBlurred}
                  blurPx={4}
                  dimOpacity={0.5}
                  disablePointerEvents
                  focusInert
                  overlayMode="inline"
                  inlinePosition="centerCenter"
                  overlay={({ isPending, error, confirm, resetError, registerErrorRef }) => (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Lock className="size-4 text-primary" aria-hidden="true" />
                        <h2 className="text-base font-semibold">Upgrade required</h2>
                      </div>
                      <p className="text-sm text-muted-foreground">Unlock detailed insights and export capabilities.</p>

                      {error ? (
                        <div
                          ref={registerErrorRef as unknown as React.RefObject<HTMLDivElement>}
                          role="alert"
                          aria-live="assertive"
                          tabIndex={-1}
                          className="mt-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          <AlertCircle className="mt-0.5 size-4" aria-hidden="true" />
                          <div>
                            {error instanceof Error ? error.message : "Something went wrong. Please try again."}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-5 flex justify-end gap-2">
                        <Button
                          onClick={() => {
                            if (error) resetError()
                            confirm()
                          }}
                          disabled={isPending}
                          aria-busy={isPending}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {isPending ? (
                            <span className="inline-flex items-center gap-2">
                              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                              Upgrading...
                            </span>
                          ) : (
                            "Upgrade now"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                  onConfirm={fakeUpgradeSometimes}
                  onUnblur={() => {
                    setBillingBlurred(false)
                    handleSectionUnlock("billing")
                  }}
                >
                  <div className="space-y-4">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Cardholder name</Label>
                        <Input id="name" placeholder="Ada Lovelace" className="border-primary/20" />
                      </div>
                      <div>
                        <Label htmlFor="card">Card number</Label>
                        <Input id="card" placeholder="4242 4242 4242 4242" className="border-primary/20" />
                      </div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <div>
                        <Label htmlFor="exp">Exp.</Label>
                        <Input id="exp" placeholder="12/28" className="border-primary/20" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" className="border-primary/20" />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP</Label>
                        <Input id="zip" placeholder="94105" className="border-primary/20" />
                      </div>
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save</Button>
                  </div>
                </BlurWrapper>
              </CardContent>
            </Card>

            {/* 3) Inline overlay "right top" with default inline content */}
            <Card className="border-primary/10 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Schedule, share, export</CardDescription>
              </CardHeader>
              <CardContent>
                <BlurWrapper
                  isBlurred={reportsBlurred}
                  blurIntensity="lg"
                  dimOpacity={0.6}
                  disablePointerEvents
                  focusInert
                  overlayMode="inline"
                  inlinePosition="rightTop"
                  confirmLabel="Unlock"
                  pendingLabel="Unlocking..."
                  onConfirm={fakeUpgradeSometimes}
                  errorMessage="We couldn't complete your upgrade. Please try again."
                  onUnblur={() => {
                    setReportsBlurred(false)
                    handleSectionUnlock("reports")
                  }}
                >
                  <div className="space-y-3">
                    <div className="rounded-lg border border-primary/10 p-4 bg-primary/5">
                      <p className="text-xs text-muted-foreground">Scheduled</p>
                      <p className="text-2xl font-semibold mt-1">8</p>
                    </div>
                    <div className="rounded-lg border border-primary/10 p-4 bg-primary/5">
                      <p className="text-xs text-muted-foreground">Exports this month</p>
                      <p className="text-2xl font-semibold mt-1">27</p>
                    </div>
                  </div>
                </BlurWrapper>
              </CardContent>
            </Card>
          </section>

          {/* Features */}
          <section className="border-2 border-primary/10 rounded-2xl p-8 bg-card/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-6">
              Why Feature Lock?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2">🎯 Context-aware upsells</h3>
                <p className="text-muted-foreground text-sm">
                  Use the right pattern for every upsell—from blurred content and inline tooltips to banners and modals.
                </p>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2">♿ Accessible by default</h3>
                <p className="text-muted-foreground text-sm">
                  Radix primitives, focus management, and ARIA helpers keep each component inclusive out of the box.
                </p>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2">⚡ Async-ready</h3>
                <p className="text-muted-foreground text-sm">
                  Built-in loading, error recovery, and analytics hooks make it easy to wire real billing flows.
                </p>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2">🎨 Flexible styling</h3>
                <p className="text-muted-foreground text-sm">
                  Tailwind-friendly APIs, render props, and composable primitives adapt to any product surface.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-sm text-muted-foreground pt-8 border-t border-primary/10">
            <p>
              Built with Next.js, Tailwind CSS, and shadcn/ui •{" "}
              <a
                href="https://github.com/gfargo/feature-lock"
                className="text-primary hover:text-primary/80 underline underline-offset-4"
                onClick={() => track("footer_github_clicked")}
              >
                View source
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}
