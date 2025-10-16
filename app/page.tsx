"use client"

import * as React from "react"
import { track } from "@vercel/analytics"
import { Hero } from "@/components/home/hero"
import { ToolkitSummary } from "@/components/home/toolkit-summary"
import { PaywallBannerSection } from "@/components/home/paywall-banner-section"
import { BlurWrapperShowcase } from "@/components/home/blur-wrapper-showcase"
import { FeatureTooltipSection } from "@/components/home/feature-tooltip-section"
import { UpgradeModalSection } from "@/components/home/upgrade-modal-section"
import { UsageProgressSection } from "@/components/home/usage-progress-section"
import { FeatureBenefits } from "@/components/home/feature-benefits"
import { FeatureFooter } from "@/components/home/feature-footer"

export default function Page() {
  React.useEffect(() => {
    track("home_viewed")
  }, [])

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="gap-16 p-8 pb-20 sm:p-20">
        <main className="mx-auto max-w-7xl space-y-16">
          <Hero />
          <ToolkitSummary />
          <PaywallBannerSection />
          <BlurWrapperShowcase />
          <FeatureTooltipSection />
          <UpgradeModalSection />
          <UsageProgressSection />
          <FeatureBenefits />
          <FeatureFooter />
        </main>
      </div>
    </div>
  )
}
