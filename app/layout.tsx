import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Feature Lock – Upgrade-ready React components",
  description:
    "Feature Lock is a suite of React components for feature gating and monetization, including BlurWrapper, PaywallBanner, FeatureTooltip, UpgradeModal, and UsageProgress.",
  keywords: [
    "feature lock",
    "react",
    "nextjs",
    "component",
    "monetization",
    "blur",
    "paywall",
    "tooltip",
    "upgrade",
    "shadcn",
    "typescript",
  ],
  authors: [{ name: "Griffen Labs" }],
  openGraph: {
    title: "Feature Lock – Upgrade-ready React components",
    description:
      "Feature Lock delivers BlurWrapper, PaywallBanner, FeatureTooltip, UpgradeModal, and UsageProgress to help teams convert users without disrupting their flow.",
    url: "https://feature-lock.griffen.codes",
    siteName: "Feature Lock",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feature Lock – Upgrade-ready React components",
    description:
      "Feature Lock bundles BlurWrapper, PaywallBanner, FeatureTooltip, UpgradeModal, and UsageProgress for contextual upsells and quotas.",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
