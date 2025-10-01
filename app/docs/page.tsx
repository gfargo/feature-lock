"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Check, Copy, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function DocsPage() {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const CodeBlock = ({ code, language = "tsx", index }: { code: string; language?: string; index: number }) => (
    <div className="relative group">
      <pre className="bg-muted border border-primary/10 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-foreground">{code}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copyToClipboard(code, index)}
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
          onClick={() => copyToClipboard(command, index)}
        >
          {copiedIndex === index ? <Check className="size-4" /> : <Copy className="size-4" />}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="p-8 pb-20 sm:p-20">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Header */}
          <header className="space-y-6">
            <Link href="/">
              <Button variant="ghost" className="-ml-4 text-primary hover:text-primary/80 hover:bg-primary/5">
                <ArrowLeft className="mr-2 size-4" />
                Back to home
              </Button>
            </Link>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
                Documentation
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Complete guide to installing and using BlurWrapper in your Next.js project
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
              <p className="text-muted-foreground">Add BlurWrapper to your project in seconds</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
                <p className="text-muted-foreground mb-4">
                  Make sure you have a Next.js project with shadcn/ui set up. If not, initialize it first:
                </p>
                <InstallCommand command="npx shadcn@latest init" index={0} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Install BlurWrapper</h3>
                <p className="text-muted-foreground mb-4">
                  Run the following command to install the component and its dependencies:
                </p>
                <InstallCommand
                  command="npx shadcn@latest add https://feature-lock.griffen.codes/r/blur-wrapper"
                  index={1}
                />
              </div>

              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <h4 className="font-semibold mb-2">✨ What gets installed?</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• BlurWrapper component at @/components/blurWrapper/blur-wrapper</li>
                  <li>• Required shadcn/ui components (Button, Dialog)</li>
                  <li>• All necessary peer dependencies (@radix-ui/react-dialog, lucide-react)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Quick Start */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                Quick Start
              </h2>
              <p className="text-muted-foreground">Get up and running in minutes</p>
            </div>

            <Tabs defaultValue="dialog" className="w-full">
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
          </section>

          {/* API Reference */}
          <section className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                API Reference
              </h2>
              <p className="text-muted-foreground">Complete prop reference and TypeScript types</p>
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

              {/* Multiple Locked Sections */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Multiple Independent Sections</h3>
                <p className="text-muted-foreground mb-4">
                  Each section can be unlocked independently with its own state:
                </p>
                <CodeBlock
                  index={5}
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
                  index={6}
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
                  <li>• Handle async errors gracefully</li>
                  <li>• Test with keyboard navigation and screen readers</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold mb-2">❌ Don't</h3>
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
                  If you see "Cannot find module" errors, verify your tsconfig.json has correct path aliases:
                </p>
                <CodeBlock
                  index={7}
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
                  index={8}
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
                  By default, the overlay shows automatically when isBlurred is true. If it's not appearing, check that
                  showOverlayOnBlur is not set to false.
                </p>
              </div>

              <div className="border-l-4 border-primary/50 bg-muted/50 p-4 rounded-r-lg">
                <h3 className="font-semibold mb-2">TypeScript errors</h3>
                <p className="text-sm text-muted-foreground">
                  Make sure you're using TypeScript 5+ and have proper type definitions installed. The component is
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
                    href="https://github.com/griffenlabs/feature-lock"
                    className="text-primary hover:text-primary/80 underline underline-offset-4"
                  >
                    View on GitHub
                  </a>
                </p>
              </div>
              <div className="flex gap-4">
                <Link href="/">
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                    Demo
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                    Blog
                  </Button>
                </Link>
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
