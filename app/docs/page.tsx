"use client";

import * as React from "react";
import { track } from "@vercel/analytics";

import { DocsFooter } from "./_components/docs-footer";
import { DocsHeader } from "./_components/docs-header";
import { InstallationSection } from "./_components/installation-section";
import { QuickStartSection } from "./_components/quick-start-section";
import { UpgradeModalApiSection } from "./_components/upgrade-modal-api-section";
import { UsageProgressApiSection } from "./_components/usage-progress-api-section";
import { BlurWrapperApiSection } from "./_components/blur-wrapper-api-section";
import { PaywallBannerApiSection } from "./_components/paywall-banner-api-section";
import { FeatureTooltipApiSection } from "./_components/feature-tooltip-api-section";
import { BestPracticesSection } from "./_components/best-practices-section";
import { TroubleshootingSection } from "./_components/troubleshooting-section";

export default function DocsPage() {
  React.useEffect(() => {
    track("docs_viewed");
  }, []);

  React.useEffect(() => {
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage =
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;

      if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage;
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
          track("docs_scroll_25");
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
          track("docs_scroll_50");
        } else if (maxScrollDepth >= 75) {
          track("docs_scroll_75");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="p-8 pb-20 sm:p-20">
        <div className="mx-auto max-w-5xl space-y-12">
          <DocsHeader />
          <InstallationSection />
          <UpgradeModalApiSection />
          <UsageProgressApiSection />
          <QuickStartSection />
          <BlurWrapperApiSection />
          <PaywallBannerApiSection />
          <FeatureTooltipApiSection />
          <BestPracticesSection />
          <TroubleshootingSection />
          <DocsFooter />
        </div>
      </div>
    </div>
  );
}
