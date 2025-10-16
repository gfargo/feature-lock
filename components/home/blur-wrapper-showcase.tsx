"use client";

import * as React from "react";
import { track } from "@vercel/analytics"
import BlurWrapper from "@/components/blurWrapper/blur-wrapper"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle, Loader2, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function BlurWrapperShowcase() {
  const [analyticsBlurred, setAnalyticsBlurred] = React.useState(true)
  const [billingBlurred, setBillingBlurred] = React.useState(true)
  const [reportsBlurred, setReportsBlurred] = React.useState(true)
  const [billingError, setBillingError] = React.useState<Error | null>(null)
  const [analyticsOverlayReady, setAnalyticsOverlayReady] = React.useState(false)
  const analyticsCardRef = React.useRef<HTMLDivElement | null>(null)
  const allBlurred = analyticsBlurred && billingBlurred && reportsBlurred

  const handleToggleAll = (checked: boolean) => {
    setAnalyticsBlurred(checked)
    setBillingBlurred(checked)
    setReportsBlurred(checked)
    track("demo_toggle_all", { blurred: checked })
  }

  const fakeUpgradeOk = async () => {
    await wait(2000)
  }
  const fakeUpgradeSometimes = async () => {
    await wait(1200)
    if (Math.random() < 0.6) throw new Error("Payment authorization failed. Please try again.")
  }

  React.useEffect(() => {
    const cardEl = analyticsCardRef.current
    if (!cardEl) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio === 1) {
            setAnalyticsOverlayReady(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 1 },
    )

    observer.observe(cardEl)

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section className="rounded-2xl border border-primary/10 bg-card/50 p-8 backdrop-blur-sm">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              BlurWrapper · Interactive demo
            </h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Toggle sections to experience blur effects, dialogs, and inline
              overlays in action.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="blur-toggle"
              checked={allBlurred}
              onCheckedChange={handleToggleAll}
              aria-label="Toggle blur"
            />
            <Label
              htmlFor="blur-toggle"
              className="cursor-pointer font-medium"
            >
              Blur all sections
            </Label>
          </div>
        </div>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card ref={analyticsCardRef} className="border-primary/10 bg-card/50 backdrop-blur-sm">
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
                    : "border-primary/20 text-muted-foreground"
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
                showOverlayOnBlur={analyticsOverlayReady}
                onConfirm={async () => {
                  await fakeUpgradeOk()
                  track("demo_section_unlocked", { section: "analytics" })
                }}
                onUnblur={() => {
                  setAnalyticsBlurred(false)
                }}
              >
                <div className="grid gap-4">
                  <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
                    <p className="text-xs text-muted-foreground">Last 7 days</p>
                    <p className="mt-1 text-2xl font-semibold">12,941</p>
                    <div className="mt-3 h-24 rounded-md bg-primary/10" />
                  </div>
                  <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
                    <p className="text-xs text-muted-foreground">
                      Conversion rate
                    </p>
                    <p className="mt-1 text-2xl font-semibold">3.7%</p>
                    <div className="mt-3 h-24 rounded-md bg-primary/10" />
                  </div>
                </div>
              </BlurWrapper>
            </CardContent>
          </Card>

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
                overlay={({
                  isPending,
                  error,
                  confirm,
                  resetError,
                  registerErrorRef,
                }) => (
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Lock
                        className="size-4 text-primary"
                        aria-hidden="true"
                      />
                      <h2 className="text-base font-semibold">
                        Upgrade required
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Unlock detailed insights and export capabilities.
                    </p>

                    {error ? (
                      <div
                        ref={registerErrorRef}
                        role="alert"
                        aria-live="assertive"
                        tabIndex={-1}
                        className="mt-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <AlertCircle
                          className="mt-0.5 size-4"
                          aria-hidden="true"
                        />
                        <div>
                          {error instanceof Error
                            ? error.message
                            : "Something went wrong. Please try again."}
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-5 flex justify-end gap-2">
                      <Button
                        onClick={() => {
                          if (error) resetError();
                          confirm();
                        }}
                        disabled={isPending}
                        aria-busy={isPending}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {isPending ? (
                          <>
                            <Loader2
                              className="mr-2 size-4 animate-spin"
                              aria-hidden="true"
                            />
                            Working...
                          </>
                        ) : (
                          "Upgrade plan"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
                onConfirm={async () => {
                  try {
                    await fakeUpgradeSometimes();
                    track("demo_section_unlocked", { section: "billing" });
                    setBillingBlurred(false);
                    setBillingError(null);
                  } catch (error) {
                    setBillingError(error as Error);
                    throw error;
                  }
                }}
              >
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="card">Card number</Label>
                    <Input
                      id="card"
                      placeholder="4242 4242 4242 4242"
                      className="border-primary/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input
                        id="expiry"
                        placeholder="08 / 27"
                        className="border-primary/20"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="zip">ZIP</Label>
                      <Input
                        id="zip"
                        placeholder="94105"
                        className="border-primary/20"
                      />
                    </div>
                  </div>
                  {billingError ? (
                    <p className="text-sm text-destructive">
                      We couldn&apos;t complete your upgrade. Please try again.
                    </p>
                  ) : null}
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Save
                  </Button>
                </div>
              </BlurWrapper>
            </CardContent>
          </Card>

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
                onConfirm={async () => {
                  await fakeUpgradeSometimes();
                  track("demo_section_unlocked", { section: "reports" });
                }}
                errorMessage="We couldn't complete your upgrade. Please try again."
                onUnblur={() => setReportsBlurred(false)}
              >
                <div className="space-y-3">
                  <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
                    <p className="text-xs text-muted-foreground">Scheduled</p>
                    <p className="mt-1 text-2xl font-semibold">8</p>
                  </div>
                  <div className="rounded-lg border border-primary/10 bg-primary/5 p-4">
                    <p className="text-xs text-muted-foreground">
                      Exports this month
                    </p>
                    <p className="mt-1 text-2xl font-semibold">27</p>
                  </div>
                </div>
              </BlurWrapper>
            </CardContent>
          </Card>
        </section>
      </section>
    </>
  );
}
