import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "BlurWrapper - Contextual Feature Locking for React",
  description:
    "A flexible React component that blurs locked features and guides users to upgrade without breaking their flow. Built with Next.js, TypeScript, and shadcn/ui.",
  keywords: ["react", "nextjs", "component", "blur", "paywall", "feature-locking", "upgrade", "shadcn", "typescript"],
  authors: [{ name: "Griffen Labs" }],
  openGraph: {
    title: "BlurWrapper - Contextual Feature Locking for React",
    description:
      "A flexible React component that blurs locked features and guides users to upgrade without breaking their flow.",
    url: "https://feature-lock.griffen.codes",
    siteName: "BlurWrapper",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlurWrapper - Contextual Feature Locking for React",
    description:
      "A flexible React component that blurs locked features and guides users to upgrade without breaking their flow.",
  },
    generator: 'v0.app'
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
