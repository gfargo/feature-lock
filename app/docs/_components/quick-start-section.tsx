"use client";

import { track } from "@vercel/analytics";

import { DocsCodeBlock } from "@/components/docs/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function QuickStartSection() {
  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Quick Start
        </h2>
        <p className="text-muted-foreground">
          Get up and running in minutes with BlurWrapper, PaywallBanner,
          FeatureTooltip, UpgradeModal, and UsageProgress
        </p>
      </div>

      <div className="space-y-12">
        <div className="space-y-4">
          <h3
            id="blurwrapper"
            className="text-xl font-semibold"
          >
            BlurWrapper
          </h3>
          <Tabs
            defaultValue="dialog"
            className="w-full"
            onValueChange={(value) =>
              track("docs_quickstart_tab_changed", { tab: value })
            }
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="dialog">Dialog Mode</TabsTrigger>
              <TabsTrigger value="inline">Inline Mode</TabsTrigger>
            </TabsList>

            <TabsContent
              value="dialog"
              className="space-y-4"
            >
              <p className="text-muted-foreground">
                Dialog mode shows the upgrade prompt in a modal overlay—great
                for critical actions:
              </p>
              <DocsCodeBlock
                index={2}
                type="quickstart_dialog"
                code={`"use client"

import { useState } from "react"
import BlurWrapper from "@/components/blurWrapper/blur-wrapper"

export function LockedFeature() {
  const [locked, setLocked] = useState(true)

  async function handleUpgrade() {
    // Your upgrade logic here
    await fetch("/api/upgrade", { method: "POST" })
    setLocked(false)
  }

  return (
    <BlurWrapper
      isBlurred={locked}
      blurIntensity="md"
      dimOpacity={0.6}
      focusInert
      dialogTitle="Upgrade Required"
      dialogDescription="Unlock this feature with a Pro plan."
      confirmLabel="Upgrade Now"
      pendingLabel="Processing..."
      onConfirm={handleUpgrade}
      onUnblur={() => setLocked(false)}
    >
      <div className="p-6 border rounded-lg">
        <h3 className="font-semibold mb-2">Premium Analytics</h3>
        <p className="text-muted-foreground">
          Advanced insights and export capabilities
        </p>
      </div>
    </BlurWrapper>
  )
}`}
              />
            </TabsContent>

            <TabsContent
              value="inline"
              className="space-y-4"
            >
              <p className="text-muted-foreground">
                Inline mode displays the upgrade prompt directly over the locked
                content—perfect for contextual upsells:
              </p>
              <DocsCodeBlock
                index={3}
                type="quickstart_inline"
                code={`"use client"

import { useState } from "react"
import BlurWrapper from "@/components/blurWrapper/blur-wrapper"

export function LockedFeature() {
  const [locked, setLocked] = useState(true)

  async function handleUpgrade() {
    await fetch("/api/upgrade", { method: "POST" })
    setLocked(false)
  }

  return (
    <BlurWrapper
      isBlurred={locked}
      overlayMode="inline"
      inlinePosition="centerCenter"
      blurIntensity="lg"
      dimOpacity={0.7}
      focusInert
      confirmLabel="Unlock Feature"
      pendingLabel="Unlocking..."
      onConfirm={handleUpgrade}
      onUnblur={() => setLocked(false)}
    >
      <div className="p-6 border rounded-lg">
        <h3 className="font-semibold mb-2">Team Reports</h3>
        <p className="text-muted-foreground">
          Schedule and share automated reports
        </p>
      </div>
    </BlurWrapper>
  )
}`}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <h3
            id="paywall-banner"
            className="text-xl font-semibold"
          >
            PaywallBanner
          </h3>
          <p className="text-muted-foreground">
            Add a dismissible announcement banner that respects user intent and
            keeps upgrade pathways visible:
          </p>
          <DocsCodeBlock
            index={6}
            type="quickstart_paywall_banner"
            code={`"use client"

import { useState } from "react"
import { PaywallBanner } from "@/components/paywallBanner/paywall-banner"

export function LaunchAnnouncement() {
  const [open, setOpen] = useState(true)

  async function handleTrial() {
    const response = await fetch("/api/trials", { method: "POST" })
    if (!response.ok) throw new Error("Unable to start trial")
  }

  return (
    <PaywallBanner
      open={open}
      onOpenChange={setOpen}
      variant="upgrade"
      badge="New feature"
      title="Workflow automation just shipped"
      description="Upgrade to the Scale plan to unlock automated handoffs, SLAs, and export scheduling."
      storageKey="workflow-automation-banner"
      ctaLabel="Start trial"
      ctaPendingLabel="Launching..."
      onCtaClick={handleTrial}
      onCtaSuccess={() => setOpen(false)}
      onCtaError={(error) => console.error(error)}
      secondaryLabel="Read release notes"
      secondaryHref="/changelog#workflow-automation"
    />
  )
}`}
          />
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-2 text-sm text-muted-foreground">
            <p>Pro tips:</p>
            <ul className="space-y-1 pl-4 list-disc">
              <li>
                Use <code>storageKey</code> to persist dismissals across
                sessions.
              </li>
              <li>
                Leverage <code>onCtaClick</code> and <code>onCtaError</code> for
                async upgrade flows.
              </li>
              <li>
                Swap <code>variant</code> between{" "}
                <code>&quot;upgrade&quot;</code>, <code>&quot;info&quot;</code>,{" "}
                <code>&quot;success&quot;</code>, and <code>&quot;warning&quot;</code>.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3
            id="feature-tooltip"
            className="text-xl font-semibold"
          >
            FeatureTooltip
          </h3>
          <p className="text-muted-foreground">
            Surface inline upsells for disabled actions, icons, or compact UI
            without forcing a modal:
          </p>
          <DocsCodeBlock
            index={8}
            type="quickstart_feature_tooltip"
            code={`"use client"

import { FeatureTooltip } from "@/components/featureTooltip/feature-tooltip"
import { Lock } from "lucide-react"

export function InlineUpsell() {
  return (
    <FeatureTooltip
      title="Unlock scheduled exports"
      description="Upgrade to automate CSV delivery to your stakeholders."
      highlights={[
        "Send summaries to unlimited recipients",
        "Choose daily, weekly, or monthly cadence",
        "Attach filtered dashboards",
      ]}
      ctaLabel="Upgrade"
      ctaHref="/pricing"
    >
      <button className="inline-flex items-center gap-2 rounded-lg border border-primary/20 px-3 py-2 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
        <Lock className="size-4" aria-hidden="true" />
        Scheduled exports (Pro)
      </button>
    </FeatureTooltip>
  )
}`}
          />
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-1 text-sm text-muted-foreground">
            <p>Use it for:</p>
            <ul className="space-y-1 pl-4 list-disc">
              <li>Disabled buttons that require higher plans</li>
              <li>Inline icons in tables or charts</li>
              <li>
                Feature flags where you still want to tease capabilities
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3
            id="upgrade-modal"
            className="text-xl font-semibold"
          >
            UpgradeModal
          </h3>
          <p className="text-muted-foreground">
            Give users a full plan comparison without leaving the current
            surface:
          </p>
          <DocsCodeBlock
            index={15}
            type="quickstart_upgrade_modal"
            code={`"use client"

import { Button } from "@/components/ui/button"
import { UpgradeModal } from "@/components/upgradeModal/upgrade-modal"

export function PlanComparison() {
  async function startGrowthCheckout() {
    const response = await fetch("/api/checkout/growth", { method: "POST" })
    if (!response.ok) throw new Error("Unable to start checkout")
  }

  return (
    <UpgradeModal
      trigger={
        <Button variant="outline">
          Compare plans
        </Button>
      }
      subtitle="Scale with confidence"
      finePrint="Prices listed in USD. Cancel anytime."
      supportEmail="sales@feature-lock.dev"
      onPlanSelected={(planId) => console.log("Selected plan:", planId)}
      plans={[
        {
          id: "growth",
          name: "Growth",
          price: "$79",
          period: "month",
          highlight: "Everything in Free, plus",
          features: [
            "Unlimited dashboards",
            "Team benchmarks",
            { label: "Priority support", footnote: "1 business-day response time" },
          ],
          ctaLabel: "Upgrade to Growth",
          onSelect: startGrowthCheckout,
        },
        {
          id: "scale",
          name: "Scale",
          recommended: true,
          badge: "Most popular",
          price: "$129",
          period: "month",
          features: [
            "AI churn forecasts",
            "Custom roles & permissions",
            "Dedicated onboarding manager",
          ],
          ctaLabel: "Talk to sales",
          ctaHref: "/contact",
        },
      ]}
    />
  )
}`}
          />
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-1 text-sm text-muted-foreground">
            <p>Best practices:</p>
            <ul className="space-y-1 pl-4 list-disc">
              <li>
                Use <code>onPlanSelected</code> to instrument analytics funnels.
              </li>
              <li>
                Set <code>autoCloseOnSelect</code> to <code>false</code> if you
                keep workflows inline.
              </li>
              <li>
                Pair with support email or footer CTA for enterprise outreach.
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <h3
            id="usage-progress"
            className="text-xl font-semibold"
          >
            UsageProgress
          </h3>
          <p className="text-muted-foreground">
            Track quota consumption, warn before limits, and embed upgrade CTAs
            directly in your dashboards:
          </p>
          <DocsCodeBlock
            index={17}
            type="quickstart_usage_progress"
            code={`"use client"

import { UsageProgress } from "@/components/usageProgress/usage-progress"

export function UsageOverview() {
  return (
    <UsageProgress
      title="Your workspace usage"
      subtitle="Quotas reset on the 1st of each month."
      tracks={[
        {
          label: "API requests",
          value: 92_300,
          limit: 100_000,
          status: "warning",
          badge: "92% used",
          trend: "up",
          description: "Scale plan adds 500k requests / month",
        },
        {
          label: "Seats",
          value: 28,
          limit: 30,
          status: "critical",
          badge: "2 remaining",
        },
      ]}
      summaryValue="Scale plan unlocks 500k requests & 100 seats"
      summaryMessage="Upgrade before May 1 to avoid throttling."
      ctaLabel="Upgrade usage"
      ctaPendingLabel="Launching checkout..."
      onCtaClick={async () => {
        const response = await fetch("/api/checkout/scale", { method: "POST" })
        if (!response.ok) throw new Error("Unable to start checkout")
      }}
      secondaryLabel="Contact sales"
      onSecondaryClick={() => window.open("mailto:sales@feature-lock.dev")}
      note="Need custom limits? Book a call with sales."
    />
  )
}`}
          />
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-1 text-sm text-muted-foreground">
            <p>Use it for:</p>
            <ul className="space-y-1 pl-4 list-disc">
              <li>Usage dashboards &amp; billing pages</li>
              <li>Account alerts near quota limits</li>
              <li>Contextual upgrade prompts after heavy usage</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
