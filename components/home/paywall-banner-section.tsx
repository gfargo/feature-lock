"use client"

import * as React from "react"
import { track } from "@vercel/analytics"
import { useRouter } from "next/navigation"
import { PaywallBanner } from "@/components/paywallBanner/paywall-banner"
import { Button } from "@/components/ui/button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function PaywallBannerSection() {
  const [open, setOpen] = React.useState(true)
  const router = useRouter()

  const handleBannerInstall = React.useCallback(async () => {
    track("home_banner_install_clicked")
    await wait(900)
    track("home_banner_install_completed")
  }, [])

  return (
    <section className="space-y-6 rounded-2xl border border-primary/10 bg-card/60 p-8 backdrop-blur-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            PaywallBanner · Announce features without hard paywalls
          </h2>
          <p className="text-muted-foreground">
            Highlight launches and quota warnings while letting users dismiss messaging when they&apos;re not ready yet.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          disabled={open}
          onClick={() => {
            setOpen(true)
            track("home_banner_reset")
          }}
        >
          Reset banner
        </Button>
      </div>

      <PaywallBanner
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) track("home_banner_dismissed")
        }}
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
        showDivider
      >
        <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
          <li>Persist dismissals with <code>storageKey</code> when you re-launch the banner.</li>
          <li>Run async upgrade flows with built-in pending and error states.</li>
        </ul>
      </PaywallBanner>
    </section>
  )
}
