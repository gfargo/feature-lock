"use client"

import * as React from "react"
import Link from "next/link"
import { track } from "@vercel/analytics"
import { ArrowLeft, Check, Copy, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function DocsPage() {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null)

  const copyToClipboard = (text: string, index: number, type: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)

    // Track code snippet copies (CONVERSION GOAL - engagement)
    track("code_copied", {
      type,
      snippet_index: index,
    })
  }

  const handleInstallCommandCopy = (command: string, index: number) => {
    copyToClipboard(command, index, "install_command")

    // Track installation intent (CONVERSION GOAL)
    track("install_command_copied", {
      command,
      timestamp: new Date().toISOString(),
    })
  }

  const CodeBlock = ({
    code,
    language = "tsx",
    index,
    type = "code",
  }: {
    code: string
    language?: string
    index: number
    type?: string
  }) => (
    <div className="relative group">
      <pre
        data-language={language}
        className={cn(
          "bg-muted border border-primary/10 rounded-lg p-4 overflow-x-auto text-sm",
          `language-${language}`,
        )}
        aria-label={`${language} code snippet`}
      >
        <code className="text-foreground">{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copyToClipboard(code, index, type)}
      >
        {copiedIndex === index ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </div>
  )

  const InstallCommand = ({ command, index }: { command: string; index: number }) => (
    <div className="relative group">
      <div className="flex items-center gap-3 bg-muted border border-primary/10 rounded-lg p-4">
        <Terminal className="size-4 text-primary flex-shrink-0" />
        <code className="text-sm text-foreground flex-1">{command}</code>
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleInstallCommandCopy(command, index)}
        >
          {copiedIndex === index ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </div>
    </div>
  )

  // Track page view
  React.useEffect(() => {
    track("docs_viewed")
  }, [])

  // Track scroll depth (CONVERSION GOAL - engagement)
  React.useEffect(() => {
    let maxScrollDepth = 0
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
          track("docs_scroll_25")
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
          track("docs_scroll_50")
        } else if (maxScrollDepth >= 75) {
          track("docs_scroll_75")
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="p-8 pb-20 sm:p-20">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Header */}
          <header className="space-y-6">
            <Link href="/">
              <Button
                variant="ghost"
                className="-ml-4 text-primary hover:text-primary/80 hover:bg-primary/5"
                onClick={() => track("docs_back_clicked")}
              >
                <ArrowLeft className="mr-2 size-4" />
                Back to home
              </Button>
            </Link>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                Documentation
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Complete guide to installing BlurWrapper, PaywallBanner, FeatureTooltip, UpgradeModal, and UsageProgress
                in your Next.js project
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary/20">
                React 19
              </Badge>
              <Badge variant="outline" className="border-primary/20">
                Next.js 14+
              </Badge>
              <Badge variant="outline" className="border-primary/20">
                TypeScript
              </Badge>
              <Badge variant="outline" className="border-primary/20">
                shadcn/ui
              </Badge>
            </div>
          </header>

          {/* Installation */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                Installation
              </h2>
              <p className="text-muted-foreground">Add Feature Lock components to your project in seconds</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
                <p className="text-muted-foreground mb-4">
                  Make sure you have a Next.js project with shadcn/ui set up. If not, initialize it first:
                </p>
                <InstallCommand command="npx shadcn@latest init" index={0} />
              </div>

              <Tabs
                defaultValue="blur-wrapper"
                className="w-full"
                onValueChange={(value) => track("docs_install_tab_changed", { component: value })}
              >
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 max-w-4xl">
                  <TabsTrigger value="blur-wrapper">BlurWrapper</TabsTrigger>
                  <TabsTrigger value="paywall-banner">PaywallBanner</TabsTrigger>
                  <TabsTrigger value="feature-tooltip">FeatureTooltip</TabsTrigger>
                  <TabsTrigger value="upgrade-modal">UpgradeModal</TabsTrigger>
                  <TabsTrigger value="usage-progress">UsageProgress</TabsTrigger>
                </TabsList>

                <TabsContent value="blur-wrapper" className="space-y-4 pt-4">
                  <p className="text-muted-foreground">
                    Run the following command to install the BlurWrapper component and its dependencies:
                  </p>
                  <InstallCommand
                    command="npx shadcn@latest add https://feature-lock.griffen.codes/r/blur-wrapper"
                    index={1}
                  />
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">✨ What gets installed?</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• BlurWrapper component at @/components/blurWrapper/blur-wrapper</li>
                      <li>• Required shadcn/ui components (Button, Dialog)</li>
                      <li>• All necessary peer dependencies (@radix-ui/react-dialog, lucide-react)</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="paywall-banner" className="space-y-4 pt-4">
                  <p className="text-muted-foreground">
                    Prefer a lightweight announcement experience? Install PaywallBanner with this command:
                  </p>
                  <InstallCommand
                    command="npx shadcn@latest add https://feature-lock.griffen.codes/r/paywall-banner"
                    index={5}
                  />
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">✨ What gets installed?</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• PaywallBanner component at @/components/paywallBanner/paywall-banner</li>
                      <li>• Required shadcn/ui components (Button, Badge)</li>
                      <li>• lucide-react icons for the default announcement glyphs</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="feature-tooltip" className="space-y-4 pt-4">
                  <p className="text-muted-foreground">
                    Need subtle inline upsells? FeatureTooltip installs with this command:
                  </p>
                  <InstallCommand
                    command="npx shadcn@latest add https://feature-lock.griffen.codes/r/feature-tooltip"
                    index={7}
                  />
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">✨ What gets installed?</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• FeatureTooltip component at @/components/featureTooltip/feature-tooltip</li>
                      <li>• Tooltip UI primitive at @/components/ui/tooltip</li>
                      <li>• lucide-react icons for the default lock/highlight styles</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="upgrade-modal" className="space-y-4 pt-4">
                  <p className="text-muted-foreground">
                    Present a full plan comparison experience with UpgradeModal:
                  </p>
                  <InstallCommand
                    command="npx shadcn@latest add https://feature-lock.griffen.codes/r/upgrade-modal"
                    index={14}
                  />
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">✨ What gets installed?</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• UpgradeModal component at @/components/upgradeModal/upgrade-modal</li>
                      <li>• Reuses existing shadcn/ui dialog + button primitives</li>
                      <li>• lucide-react icons for plan highlights & pending states</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="usage-progress" className="space-y-4 pt-4">
                  <p className="text-muted-foreground">
                    Visualize quotas and drive upgrades with UsageProgress:
                  </p>
                  <InstallCommand
                    command="npx shadcn@latest add https://feature-lock.griffen.codes/r/usage-progress"
                    index={16}
                  />
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold mb-2">✨ What gets installed?</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• UsageProgress component at @/components/usageProgress/usage-progress</li>
                      <li>• Shared progress bar helper at @/components/usageProgress/usage-progress-bar</li>
                      <li>• No extra primitives needed—works with existing shadcn/ui buttons & badges</li>
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* UpgradeModal API */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                UpgradeModal API
              </h2>
              <p className="text-muted-foreground">Prop reference for the standalone upgrade dialog experience</p>
            </div>

            <div className="space-y-8">
              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Core Props</h3>
                <div className="space-y-4">
                  <PropDoc name="plans" type="UpgradePlan[]" description="Plan definitions rendered inside the modal" />
                  <PropDoc
                    name="trigger"
                    type="React.ReactNode"
                    description="Optional trigger rendered as a dialog trigger via asChild"
                  />
                  <PropDoc
                    name="open"
                    type="boolean"
                    description="Controlled open state; pair with onOpenChange for external toggles"
                  />
                  <PropDoc
                    name="defaultOpen"
                    type="boolean"
                    description="Initial open state when the modal manages its own visibility"
                  />
                  <PropDoc
                    name="onOpenChange"
                    type="(open: boolean) => void"
                    description="Fired whenever the dialog open state changes"
                  />
                  <PropDoc
                    name="onClose"
                    type="() => void"
                    description="Invoked after the modal closes (user action or programmatic)"
                  />
                  <PropDoc
                    name="onPlanSelected"
                    type="(planId: string) => void"
                    description="Receive the plan id after a CTA resolves successfully"
                  />
                </div>
              </div>

              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Content & Styling</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="title"
                    type="string"
                    defaultValue='"Unlock more with Feature Lock"'
                    description="Modal heading shown at the top of the dialog"
                  />
                  <PropDoc name="subtitle" type="string" description="Optional subheading styled in the primary color" />
                  <PropDoc
                    name="description"
                    type="string"
                    description="Supporting paragraph that explains the upgrade value"
                  />
                  <PropDoc
                    name="badge"
                    type="string | null"
                    defaultValue='"Upgrade"'
                    description="Small badge rendered above the title; set to null to hide"
                  />
                  <PropDoc
                    name="highlightLabel"
                    type="string"
                    defaultValue='"Everything in Free, plus"'
                    description="Label displayed before each plan's feature list"
                  />
                  <PropDoc
                    name="finePrint"
                    type="string"
                    description="Fine print text displayed underneath the plan grid"
                  />
                  <PropDoc
                    name="supportEmail"
                    type="string"
                    description="Adds a support callout with a clickable mailto link"
                  />
                  <PropDoc
                    name="supportLabel"
                    type="string"
                    defaultValue='"Need help? Reach out:"'
                    description="Label shown before the support email link"
                  />
                  <PropDoc
                    name="footer"
                    type="React.ReactNode"
                    description="Custom footer content (secondary actions, guarantees, etc.)"
                  />
                  <PropDoc
                    name="className"
                    type="string"
                    description="Extra classes applied to the dialog content wrapper"
                  />
                  <PropDoc
                    name="contentClassName"
                    type="string"
                    description="Extra classes for the inner content layout"
                  />
                  <PropDoc
                    name="planCardClassName"
                    type="string"
                    description="Extra classes appended to every plan card"
                  />
                  <PropDoc
                    name="showCloseButton"
                    type="boolean"
                    defaultValue="true"
                    description="Toggle the default top-right close button"
                  />
                </div>
              </div>

              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Behavior</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="autoCloseOnSelect"
                    type="boolean"
                    defaultValue="true"
                    description="Automatically closes the modal when a plan CTA succeeds"
                  />
                  <PropDoc
                    name="resetErrorsOnOpen"
                    type="boolean"
                    defaultValue="true"
                    description="Clears pending/error state whenever the modal reopens"
                  />
                </div>
              </div>

              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50 space-y-3">
                <h3 className="text-xl font-semibold">UpgradePlan fields</h3>
                <p className="text-sm text-muted-foreground">
                  Each entry in <code>plans</code> accepts the following properties:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>
                    <code>id</code>: unique identifier used for analytics callbacks and pending/error state tracking.
                  </li>
                  <li>
                    <code>name</code>, <code>description</code>, <code>price</code>, <code>period</code>, <code>badge</code>,
                    <code>highlight</code>, <code>footnote</code>: text content for the plan card.
                  </li>
                  <li>
                    <code>features</code>: array of strings or <code>{`{ label, included?, footnote? }`}</code> objects to
                    render capability lists.
                  </li>
                  <li>
                    <code>ctaLabel</code>, <code>ctaHref</code>, <code>ctaPendingLabel</code>: customize primary CTA text
                    and link behavior.
                  </li>
                  <li>
                    <code>onSelect</code>, <code>onSelectSuccess</code>, <code>onSelectError</code>: async handler and hooks
                    for custom upgrade flows.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* UsageProgress API */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                UsageProgress API
              </h2>
              <p className="text-muted-foreground">Props for the quota tracking component</p>
            </div>

            <div className="space-y-8">
              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Core Props</h3>
                <div className="space-y-4">
                  <PropDoc name="tracks" type="UsageTrack[]" description="Usage rows displayed with progress bars" />
                  <PropDoc
                    name="variant"
                    type='"card" | "inline"'
                    defaultValue='"card"'
                    description="Switch between card layout and inline section"
                  />
                  <PropDoc
                    name="title"
                    type="string"
                    defaultValue='"Usage overview"'
                    description="Heading shown above the usage metrics"
                  />
                  <PropDoc
                    name="subtitle"
                    type="string"
                    defaultValue='"Stay on top of quota limits and see when to upgrade."'
                    description="Supporting text displayed under the heading"
                  />
                  <PropDoc
                    name="showSummary"
                    type="boolean"
                    defaultValue="true"
                    description="Toggle visibility of the summary/info banner"
                  />
                  <PropDoc
                    name="summaryLabel"
                    type="string"
                    defaultValue='"Upgrade unlocks"'
                    description="Label displayed in the summary banner"
                  />
                  <PropDoc
                    name="summaryValue"
                    type="string"
                    description="Highlighted value shown on the right side of the summary banner"
                  />
                  <PropDoc
                    name="summaryMessage"
                    type="string"
                    description="Additional text under the summary label"
                  />
                  <PropDoc name="note" type="string" description="Small note displayed alongside CTAs" />
                </div>
              </div>

              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Actions</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="ctaLabel"
                    type="string"
                    defaultValue='"Upgrade plan"'
                    description="Primary CTA button label"
                  />
                  <PropDoc
                    name="ctaHref"
                    type="string"
                    description="Link target if no async handler is provided"
                  />
                  <PropDoc
                    name="ctaPendingLabel"
                    type="string"
                    defaultValue='"Working..."'
                    description="Text shown while the CTA handler resolves"
                  />
                  <PropDoc
                    name="onCtaClick"
                    type="() => Promise<void> | void"
                    description="Async handler for the primary CTA"
                  />
                  <PropDoc
                    name="onCtaSuccess"
                    type="() => void"
                    description="Callback fired after a successful CTA"
                  />
                  <PropDoc
                    name="onCtaError"
                    type="(error: unknown) => void"
                    description="Callback fired when the CTA handler throws"
                  />
                  <PropDoc
                    name="secondaryLabel"
                    type="string"
                    description="Label for the optional secondary button"
                  />
                  <PropDoc
                    name="onSecondaryClick"
                    type="() => void"
                    description="Handler for the secondary action"
                  />
                  <PropDoc
                    name="pending"
                    type="boolean"
                    defaultValue="false"
                    description="Force the CTA into a loading state externally"
                  />
                </div>
              </div>

              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50 space-y-3">
                <h3 className="text-xl font-semibold">UsageTrack fields</h3>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>
                    <code>label</code> (string): Display name for the quota. <code>value</code> (number) and
                    <code>limit</code> (number) calculate percentages automatically.
                  </li>
                  <li>
                    <code>percentage</code> (number): Override percentage when no limit applies.
                    <code>status</code> controls styling (<code>"ok"</code>, <code>"warning"</code>, <code>"critical"</code>).
                  </li>
                  <li>
                    Optional fields: <code>badge</code>, <code>trend</code> (<code>"up"</code>, <code>"down"</code>,
                    <code>"steady"</code>), <code>description</code>. They reinforce messaging without clutter.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Quick Start */}
          <section className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                Quick Start
              </h2>
              <p className="text-muted-foreground">
                Get up and running in minutes with BlurWrapper, PaywallBanner, FeatureTooltip, and UpgradeModal
              </p>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <h3 id="blurwrapper" className="text-xl font-semibold">BlurWrapper</h3>
                <Tabs
                  defaultValue="dialog"
                  className="w-full"
                  onValueChange={(value) => track("docs_quickstart_tab_changed", { tab: value })}
                >
                  <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="dialog">Dialog Mode</TabsTrigger>
                    <TabsTrigger value="inline">Inline Mode</TabsTrigger>
                  </TabsList>

                  <TabsContent value="dialog" className="space-y-4">
                    <p className="text-muted-foreground">
                      Dialog mode shows the upgrade prompt in a modal overlay—great for critical actions:
                    </p>
                    <CodeBlock
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

                  <TabsContent value="inline" className="space-y-4">
                    <p className="text-muted-foreground">
                      Inline mode displays the upgrade prompt directly over the locked content—perfect for contextual
                      upsells:
                    </p>
                    <CodeBlock
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
                <h3 id="paywall-banner" className="text-xl font-semibold">PaywallBanner</h3>
                <p className="text-muted-foreground">
                  Add a dismissible announcement banner that respects user intent and keeps upgrade pathways visible:
                </p>
                <CodeBlock
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
                    <li>Use <code>storageKey</code> to persist dismissals across sessions.</li>
                    <li>Leverage <code>onCtaClick</code> and <code>onCtaError</code> for async upgrade flows.</li>
                    <li>
                      Swap <code>variant</code> between <code>&quot;upgrade&quot;</code>, <code>&quot;info&quot;</code>,{" "}
                      <code>&quot;success&quot;</code>, and <code>&quot;warning&quot;</code>.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 id="feature-tooltip" className="text-xl font-semibold">FeatureTooltip</h3>
                <p className="text-muted-foreground">
                  Surface inline upsells for disabled actions, icons, or compact UI without forcing a modal:
                </p>
                <CodeBlock
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
                    <li>Feature flags where you still want to tease capabilities</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 id="upgrade-modal" className="text-xl font-semibold">UpgradeModal</h3>
                <p className="text-muted-foreground">
                  Give users a full plan comparison without leaving the current surface:
                </p>
                <CodeBlock
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
                    <li>Use <code>onPlanSelected</code> to instrument analytics funnels.</li>
                    <li>Set <code>autoCloseOnSelect</code> to <code>false</code> if you keep workflows inline.</li>
                    <li>Pair with support email or footer CTA for enterprise outreach.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 id="usage-progress" className="text-xl font-semibold">UsageProgress</h3>
                <p className="text-muted-foreground">
                  Track quota consumption, warn before limits, and embed upgrade CTAs directly in your dashboards:
                </p>
                <CodeBlock
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
                    <li>Usage dashboards & billing pages</li>
                    <li>Account alerts near quota limits</li>
                    <li>Contextual upgrade prompts after heavy usage</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* BlurWrapper API */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                BlurWrapper API
              </h2>
              <p className="text-muted-foreground">Complete prop reference and TypeScript types for BlurWrapper</p>
            </div>

            <div className="space-y-8">
              {/* Core Props */}
              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Core Props</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="isBlurred"
                    type="boolean"
                    defaultValue="false"
                    description="When true, applies blur effect and shows overlay"
                  />
                  <PropDoc
                    name="overlayMode"
                    type='"dialog" | "inline"'
                    defaultValue='"dialog"'
                    description="Controls whether overlay appears as modal dialog or inline panel"
                  />
                  <PropDoc
                    name="onConfirm"
                    type="() => Promise<void> | void"
                    description="Async function called when user clicks confirm button"
                  />
                  <PropDoc
                    name="onUnblur"
                    type="() => void"
                    description="Callback fired after successful confirmation (auto-called if autoUnblurOnConfirm is true)"
                  />
                </div>
              </div>

              {/* Visual Props */}
              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Visual Customization</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="blurIntensity"
                    type='"sm" | "md" | "lg" | "xl" | "2xl" | "3xl"'
                    defaultValue='"md"'
                    description="Tailwind blur class to apply (overridden by blurPx if set)"
                  />
                  <PropDoc
                    name="blurPx"
                    type="number"
                    description="Exact blur amount in pixels (overrides blurIntensity)"
                  />
                  <PropDoc
                    name="dimOpacity"
                    type="number"
                    defaultValue="1"
                    description="Opacity of blurred content (0 to 1)"
                  />
                  <PropDoc
                    name="disablePointerEvents"
                    type="boolean"
                    defaultValue="true"
                    description="Prevents clicking/interacting with blurred content"
                  />
                  <PropDoc
                    name="icon"
                    type="LucideIcon"
                    description="Custom Lucide icon to display in overlay (default: Lock)"
                  />
                </div>
              </div>

              {/* Accessibility Props */}
              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Accessibility</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="focusInert"
                    type="boolean"
                    defaultValue="true"
                    description="Adds inert and aria-hidden to prevent keyboard focus on blurred content"
                  />
                  <PropDoc
                    name="announcePending"
                    type="boolean"
                    defaultValue="true"
                    description="Screen reader announces pending state during async operations"
                  />
                  <PropDoc
                    name="focusErrorOnSet"
                    type="boolean"
                    defaultValue="true"
                    description="Automatically moves focus to error message when error occurs"
                  />
                  <PropDoc
                    name="returnFocusTo"
                    type="HTMLElement | string"
                    description="Element or selector to restore focus to after overlay closes"
                  />
                </div>
              </div>

              {/* Label Props */}
              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Labels & Content</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="confirmLabel"
                    type="string"
                    defaultValue='"Confirm"'
                    description="Text for the confirm button"
                  />
                  <PropDoc
                    name="pendingLabel"
                    type="string"
                    defaultValue='"Working..."'
                    description="Text shown during async operation"
                  />
                  <PropDoc
                    name="dialogTitle"
                    type="string"
                    defaultValue='"Feature unavailable"'
                    description="Title for dialog mode overlay"
                  />
                  <PropDoc name="dialogDescription" type="string" description="Description text for dialog mode" />
                  <PropDoc
                    name="errorMessage"
                    type="string"
                    description="Default error message to display on failure"
                  />
                  <PropDoc
                    name="secondaryLabel"
                    type="string"
                    description="Text for the secondary action button"
                  />
                  <PropDoc
                    name="secondaryPendingLabel"
                    type="string"
                    defaultValue='"Working..."'
                    description="Text shown during secondary action async operation"
                  />
                </div>
              </div>

              {/* Secondary Actions */}
              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Secondary Actions</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="onSecondaryConfirm"
                    type="() => Promise<void> | void"
                    description="Async function called when user clicks secondary action button"
                  />
                  <PropDoc
                    name="onSecondaryConfirmError"
                    type="(error: unknown) => void"
                    description="Callback fired when secondary action fails"
                  />
                  <PropDoc
                    name="onSecondaryConfirmFinally"
                    type='(result: "success" | "error") => void'
                    description="Callback fired after secondary action completes (success or error)"
                  />
                </div>
              </div>

              {/* Inline Mode Props */}
              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Inline Mode</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="inlinePosition"
                    type='"leftTop" | "leftCenter" | "leftBottom" | "centerTop" | "centerCenter" | "centerBottom" | "rightTop" | "rightCenter" | "rightBottom"'
                    defaultValue='"centerCenter"'
                    description="Position of inline overlay panel"
                  />
                  <PropDoc
                    name="inlineContainerClassName"
                    type="string"
                    description="Custom classes for inline overlay container"
                  />
                  <PropDoc
                    name="inlinePanelClassName"
                    type="string"
                    description="Custom classes for inline overlay panel"
                  />
                  <PropDoc
                    name="inlineAriaLabel"
                    type="string"
                    defaultValue='"Upgrade panel"'
                    description="ARIA label for inline overlay"
                  />
                </div>
              </div>

              {/* Advanced Props */}
              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Advanced</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="overlay"
                    type="ReactNode | (args) => ReactNode"
                    description="Custom overlay content (function receives isPending, error, confirm, etc.)"
                  />
                  <PropDoc
                    name="open"
                    type="boolean"
                    description="Controlled open state for overlay (use with onOpenChange)"
                  />
                  <PropDoc
                    name="onOpenChange"
                    type="(open: boolean) => void"
                    description="Callback when overlay open state changes"
                  />
                  <PropDoc
                    name="autoUnblurOnConfirm"
                    type="boolean"
                    defaultValue="true"
                    description="Automatically call onUnblur after successful confirmation"
                  />
                  <PropDoc
                    name="autoCloseDialogOnConfirm"
                    type="boolean"
                    defaultValue="true"
                    description="Close dialog after successful confirmation"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Advanced Examples */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                Advanced Examples
              </h2>
              <p className="text-muted-foreground">Custom overlays and advanced patterns</p>
            </div>

            <div className="space-y-8">
              {/* Custom Overlay */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Custom Overlay with Error Handling</h3>
                <p className="text-muted-foreground mb-4">
                  Use the render-prop pattern for full control over overlay content and error handling:
                </p>
                <CodeBlock
                  index={4}
                  type="advanced_custom_overlay"
                  code={`<BlurWrapper
  isBlurred={locked}
  overlayMode="inline"
  inlinePosition="centerCenter"
  onConfirm={async () => {
    const response = await fetch("/api/upgrade", { method: "POST" })
    if (!response.ok) throw new Error("Payment failed")
  }}
  onUnblur={() => setLocked(false)}
  overlay={({ isPending, error, confirm, resetError, registerErrorRef }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lock className="size-4 text-primary" />
        <h3 className="font-semibold">Unlock Premium Features</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Get unlimited exports and advanced analytics
      </p>

      {error && (
        <div
          ref={registerErrorRef}
          role="alert"
          tabIndex={-1}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
        >
          <strong>Error:</strong>{" "}
          {error instanceof Error ? error.message : "Something went wrong"}
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <Button
          onClick={() => {
            if (error) resetError()
            confirm()
          }}
          disabled={isPending}
        >
          {isPending ? "Processing..." : "Upgrade Now"}
        </Button>
      </div>
    </div>
  )}
>
  <YourLockedContent />
</BlurWrapper>`}
                />
              </div>

              {/* Secondary Action Button */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Secondary Action Button</h3>
                <p className="text-muted-foreground mb-4">
                  Add a secondary button for alternative actions like &ldquo;Learn More&rdquo; or &ldquo;Contact
                  Sales&rdquo;:
                </p>
                <CodeBlock
                  index={9}
                  type="advanced_secondary_action"
                  code={`<BlurWrapper
  isBlurred={locked}
  overlayMode="dialog"
  dialogTitle="Upgrade to Pro"
  dialogDescription="Unlock advanced features and premium support"
  confirmLabel="Start Free Trial"
  secondaryLabel="Learn More"
  onConfirm={async () => {
    await startTrial()
    setLocked(false)
  }}
  onSecondaryConfirm={async () => {
    // Open documentation or pricing page
    window.open("/pricing", "_blank")
  }}
  onUnblur={() => setLocked(false)}
>
  <PremiumFeatureContent />
</BlurWrapper>`}
                />
              </div>

              {/* Multiple Locked Sections */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Multiple Independent Sections</h3>
                <p className="text-muted-foreground mb-4">
                  Each section can be unlocked independently with its own state:
                </p>
                <CodeBlock
                  index={10}
                  type="advanced_multiple_sections"
                  code={`export function Dashboard() {
  const [analyticsLocked, setAnalyticsLocked] = useState(true)
  const [reportsLocked, setReportsLocked] = useState(true)
  const [exportsLocked, setExportsLocked] = useState(true)

  async function upgradeFeature(feature: string) {
    await fetch("/api/upgrade", {
      method: "POST",
      body: JSON.stringify({ feature })
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <BlurWrapper
        isBlurred={analyticsLocked}
        onConfirm={() => upgradeFeature("analytics")}
        onUnblur={() => setAnalyticsLocked(false)}
      >
        <AnalyticsCard />
      </BlurWrapper>

      <BlurWrapper
        isBlurred={reportsLocked}
        onConfirm={() => upgradeFeature("reports")}
        onUnblur={() => setReportsLocked(false)}
      >
        <ReportsCard />
      </BlurWrapper>

      <BlurWrapper
        isBlurred={exportsLocked}
        onConfirm={() => upgradeFeature("exports")}
        onUnblur={() => setExportsLocked(false)}
      >
        <ExportsCard />
      </BlurWrapper>
    </div>
  )
}`}
                />
              </div>

              {/* Controlled State */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Controlled Overlay State</h3>
                <p className="text-muted-foreground mb-4">Control when the overlay appears for custom flows:</p>
                <CodeBlock
                  index={11}
                  type="advanced_controlled_state"
                  code={`export function ControlledExample() {
  const [locked, setLocked] = useState(true)
  const [overlayOpen, setOverlayOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOverlayOpen(true)}>
        Unlock Feature
      </Button>

      <BlurWrapper
        isBlurred={locked}
        open={overlayOpen}
        onOpenChange={setOverlayOpen}
        onConfirm={async () => {
          await upgradeUser()
          setLocked(false)
          setOverlayOpen(false)
        }}
      >
        <LockedContent />
      </BlurWrapper>
    </>
  )
}`}
                />
              </div>
            </div>
          </section>

          {/* PaywallBanner API */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                PaywallBanner API
              </h2>
              <p className="text-muted-foreground">Key props for the announcement banner component</p>
            </div>

            <div className="space-y-8">
              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Core Props</h3>
                <div className="space-y-4">
                  <PropDoc name="title" type="string" description="Primary headline for the announcement banner" />
                  <PropDoc
                    name="description"
                    type="string"
                    description="Supporting copy displayed under the title"
                  />
                  <PropDoc
                    name="badge"
                    type="string | null"
                    defaultValue='"New"'
                    description="Optional badge label; set to null to hide"
                  />
                  <PropDoc
                    name="variant"
                    type='"upgrade" | "info" | "success" | "warning"'
                    defaultValue='"upgrade"'
                    description="Determines accent styling for the banner"
                  />
                  <PropDoc
                    name="dismissible"
                    type="boolean"
                    defaultValue="true"
                    description="Controls whether the close button is rendered"
                  />
                  <PropDoc
                    name="storageKey"
                    type="string"
                    description="Persist dismissals in localStorage using this key"
                  />
                  <PropDoc
                    name="defaultOpen"
                    type="boolean"
                    defaultValue="true"
                    description="Initial visibility when the component is uncontrolled"
                  />
                  <PropDoc
                    name="open"
                    type="boolean"
                    description="Controlled visibility state for the banner"
                  />
                  <PropDoc
                    name="onOpenChange"
                    type="(open: boolean) => void"
                    description="Callback fired whenever visibility changes"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                  <h3 className="text-xl font-semibold mb-4">Primary Action</h3>
                  <div className="space-y-4">
                    <PropDoc
                      name="ctaLabel"
                      type="string"
                      defaultValue='"Upgrade now"'
                      description="Text for the primary button"
                    />
                    <PropDoc
                      name="ctaHref"
                      type="string"
                      description="Link target when no onCtaClick handler is provided"
                    />
                    <PropDoc
                      name="onCtaClick"
                      type="() => Promise<void> | void"
                      description="Async handler for the primary action"
                    />
                    <PropDoc
                      name="ctaPendingLabel"
                      type="string"
                      defaultValue='"Working..."'
                      description="Text shown while onCtaClick resolves"
                    />
                    <PropDoc
                      name="onCtaSuccess"
                      type="() => void"
                      description="Called after onCtaClick resolves without error"
                    />
                    <PropDoc
                      name="onCtaError"
                      type="(error: unknown) => void"
                      description="Called when onCtaClick throws or rejects"
                    />
                  </div>
                </div>

                <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                  <h3 className="text-xl font-semibold mb-4">Secondary &amp; Dismiss</h3>
                  <div className="space-y-4">
                    <PropDoc
                      name="secondaryLabel"
                      type="string"
                      description="Text for the optional secondary button"
                    />
                    <PropDoc
                      name="secondaryHref"
                      type="string"
                      description="Link target when no onSecondaryClick handler is provided"
                    />
                    <PropDoc
                      name="onSecondaryClick"
                      type="() => Promise<void> | void"
                      description="Async handler for the secondary action"
                    />
                    <PropDoc
                      name="onSecondarySuccess"
                      type="() => void"
                      description="Called after onSecondaryClick resolves without error"
                    />
                    <PropDoc
                      name="onSecondaryError"
                      type="(error: unknown) => void"
                      description="Called when the secondary handler throws or rejects"
                    />
                    <PropDoc name="onDismiss" type="() => void" description="Fired when the banner is dismissed" />
                  </div>
                </div>
              </div>

              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Layout &amp; Content</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="showDivider"
                    type="boolean"
                    defaultValue="false"
                    description="Adds a divider between content and actions on larger screens"
                  />
                  <PropDoc
                    name="className"
                    type="string"
                    description="Custom classes for the banner container"
                  />
                  <PropDoc
                    name="contentClassName"
                    type="string"
                    description="Custom classes for the text/content column"
                  />
                  <PropDoc
                    name="actionsClassName"
                    type="string"
                    description="Custom classes for the action button container"
                  />
                  <PropDoc
                    name="children"
                    type="React.ReactNode"
                    description="Optional additional content (e.g. bullet lists or disclaimers)"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* FeatureTooltip API */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                FeatureTooltip API
              </h2>
              <p className="text-muted-foreground">Props for lightweight inline upgrade nudges</p>
            </div>

            <div className="space-y-8">
              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Core Props</h3>
                <div className="space-y-4">
                  <PropDoc name="title" type="string" description="Headline displayed at the top of the tooltip" />
                  <PropDoc
                    name="description"
                    type="string"
                    description="Supporting body copy underneath the title"
                  />
                  <PropDoc
                    name="badge"
                    type="string | null"
                    defaultValue='"Upgrade to unlock"'
                    description="Optional badge text shown next to the icon; set to null to hide"
                  />
                  <PropDoc
                    name="icon"
                    type="LucideIcon"
                    defaultValue="Lock"
                    description="Icon rendered within the tooltip header"
                  />
                  <PropDoc
                    name="children"
                    type="React.ReactNode"
                    description="Trigger element that displays the tooltip on hover or focus"
                  />
                  <PropDoc
                    name="disabled"
                    type="boolean"
                    defaultValue="false"
                    description="Render children without tooltip behavior when true"
                  />
                </div>
              </div>

              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Highlights & Styling</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="highlights"
                    type='(string | { icon?: LucideIcon; label: string })[]'
                    description="List of feature value props shown as bullet items"
                  />
                  <PropDoc
                    name="highlightIcon"
                    type="LucideIcon"
                    defaultValue="CheckCircle2"
                    description="Icon used when highlights are provided as strings"
                  />
                  <PropDoc
                    name="className"
                    type="string"
                    description="Custom classes applied to the trigger wrapper"
                  />
                  <PropDoc
                    name="contentClassName"
                    type="string"
                    description="Custom classes applied to the tooltip content container"
                  />
                  <PropDoc
                    name="badgeClassName"
                    type="string"
                    description="Custom classes for styling the badge element"
                  />
                </div>
              </div>

              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">CTA & Events</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="ctaLabel"
                    type="string"
                    defaultValue='"Upgrade"'
                    description="Label for the primary call-to-action button"
                  />
                  <PropDoc
                    name="ctaHref"
                    type="string"
                    description="Link URL for the CTA when no async handler is provided"
                  />
                  <PropDoc
                    name="ctaPendingLabel"
                    type="string"
                    defaultValue='"Working..."'
                    description="Label shown while onCtaClick is resolving"
                  />
                  <PropDoc
                    name="onCtaClick"
                    type="() => Promise<void> | void"
                    description="Async handler invoked when the CTA button is clicked"
                  />
                  <PropDoc
                    name="onCtaSuccess"
                    type="() => void"
                    description="Callback fired after the CTA handler resolves successfully"
                  />
                  <PropDoc
                    name="onCtaError"
                    type="(error: unknown) => void"
                    description="Callback fired when the CTA handler throws or rejects"
                  />
                </div>
              </div>

              <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
                <h3 className="text-xl font-semibold mb-4">Positioning & Control</h3>
                <div className="space-y-4">
                  <PropDoc
                    name="side"
                    type='"top" | "bottom" | "left" | "right"'
                    defaultValue='"top"'
                    description="Placement of the tooltip relative to the trigger"
                  />
                  <PropDoc
                    name="align"
                    type='"start" | "center" | "end"'
                    defaultValue='"center"'
                    description="Alignment of the tooltip on the chosen side"
                  />
                  <PropDoc
                    name="sideOffset"
                    type="number"
                    defaultValue="12"
                    description="Pixels of offset between tooltip and trigger"
                  />
                  <PropDoc
                    name="delayDuration"
                    type="number"
                    defaultValue="200"
                    description="Delay in milliseconds before the tooltip appears"
                  />
                  <PropDoc
                    name="open"
                    type="boolean"
                    description="Controlled open state for the tooltip"
                  />
                  <PropDoc
                    name="defaultOpen"
                    type="boolean"
                    description="Initial open state when uncontrolled"
                  />
                  <PropDoc
                    name="onOpenChange"
                    type="(open: boolean) => void"
                    description="Callback fired whenever the tooltip open state changes"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                Best Practices
              </h2>
              <p className="text-muted-foreground">Tips for optimal implementation</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h3 className="font-semibold mb-2">✅ Do</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Use dialog mode for critical upgrade decisions</li>
                  <li>• Use inline mode for contextual feature teasers</li>
                  <li>• Provide clear value propositions in overlay content</li>
                  <li>• Persist dismissals with PaywallBanner storage keys to respect user intent</li>
                  <li>• Handle async errors gracefully</li>
                  <li>• Test with keyboard navigation and screen readers</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold mb-2">❌ Don&apos;t</h3>
                <ul className="space-y-1 text-sm text-red-900">
                  <li>• Lock too many features at once</li>
                  <li>• Use aggressive blur that makes content unrecognizable</li>
                  <li>• Forget to handle loading and error states</li>
                  <li>• Disable pointer events if user needs to scroll</li>
                  <li>• Mix dialog and inline modes inconsistently</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Troubleshooting */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                Troubleshooting
              </h2>
              <p className="text-muted-foreground">Common issues and solutions</p>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-primary/50 bg-muted/50 p-4 rounded-r-lg">
                <h3 className="font-semibold mb-2">Import errors</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  If you see &ldquo;Cannot find module&rdquo; errors, verify your tsconfig.json has correct path aliases:
                </p>
                <CodeBlock
                  index={12}
                  type="troubleshooting_imports"
                  code={`{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}`}
                />
              </div>

              <div className="border-l-4 border-primary/50 bg-muted/50 p-4 rounded-r-lg">
                <h3 className="font-semibold mb-2">Blur not visible</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Ensure your content has a non-transparent background. The blur effect works by filtering the content:
                </p>
                <CodeBlock
                  index={13}
                  type="troubleshooting_blur"
                  code={`<BlurWrapper isBlurred={locked}>
  <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
    {/* Your content */}
  </div>
</BlurWrapper>`}
                />
              </div>

              <div className="border-l-4 border-primary/50 bg-muted/50 p-4 rounded-r-lg">
                <h3 className="font-semibold mb-2">Overlay not showing</h3>
                <p className="text-sm text-muted-foreground">
                  By default, the overlay shows automatically when isBlurred is true. If it&apos;s not appearing, check
                  that showOverlayOnBlur is not set to false.
                </p>
              </div>

              <div className="border-l-4 border-primary/50 bg-muted/50 p-4 rounded-r-lg">
                <h3 className="font-semibold mb-2">TypeScript errors</h3>
                <p className="text-sm text-muted-foreground">
                  Make sure you&apos;re using TypeScript 5+ and have proper type definitions installed. The component is
                  fully typed with TypeScript.
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="pt-12 border-t border-primary/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Need more help?{" "}
                  <a
                    href="https://github.com/gfargo/feature-lock"
                    className="text-primary hover:text-primary/80 underline underline-offset-4"
                    onClick={() => track("docs_github_clicked")}
                  >
                    View on GitHub
                  </a>
                </p>
              </div>
              <div className="flex gap-4">
                <Link href="/">
                  <Button
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/5 bg-transparent"
                    onClick={() => track("docs_demo_clicked")}
                  >
                    Demo
                  </Button>
                </Link>
                <a
                  href="https://github.com/gfargo/feature-lock"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/5 bg-transparent"
                    onClick={() => track("docs_blog_clicked")}
                  >
                    GitHub
                  </Button>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

function PropDoc({
  name,
  type,
  defaultValue,
  description,
}: {
  name: string
  type: string
  defaultValue?: string
  description: string
}) {
  return (
    <div className="pb-4 border-b border-primary/10 last:border-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="font-mono text-sm font-semibold">{name}</div>
        {defaultValue && (
          <Badge variant="secondary" className="text-xs">
            {defaultValue}
          </Badge>
        )}
      </div>
      <div className="font-mono text-xs text-primary mb-2">{type}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  )
}
