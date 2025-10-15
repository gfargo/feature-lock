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
import { AlertCircle, Loader2, Lock, ArrowRight, Sparkles, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Page() {
  const router = useRouter()
  const [bannerOpen, setBannerOpen] = React.useState(true)
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

  // Track page view
  React.useEffect(() => {
    track("home_viewed")
  }, [])

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
              BlurWrapper
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              A flexible React component that blurs locked features and guides users to upgrade—without breaking their
              flow.
            </p>

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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                  Announce features without hard paywalls
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

          {/* Interactive Demo Controls */}
          <section className="border-2 border-primary/10 rounded-2xl p-8 bg-card/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                  Interactive Demo
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
              Why BlurWrapper?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2">🎯 Context-aware upsells</h3>
                <p className="text-muted-foreground text-sm">
                  Show upgrade prompts exactly where users need premium features—not in a separate pricing page.
                </p>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2">♿ Accessible by default</h3>
                <p className="text-muted-foreground text-sm">
                  Focus blocking, screen reader announcements, and keyboard shortcuts built-in.
                </p>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2">⚡ Async-ready</h3>
                <p className="text-muted-foreground text-sm">
                  Handle upgrade flows with React 19&rsquo;s useTransition—pending states, error handling, focus
                  management.
                </p>
              </div>
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2">🎨 Flexible styling</h3>
                <p className="text-muted-foreground text-sm">
                  Dialog or inline overlays, custom render props, and full control over positioning.
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
