"use client"

import Link from "next/link"
import { track } from "@vercel/analytics"
import { Sparkles, BookOpen, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const SUITE_BADGES = ["BlurWrapper", "PaywallBanner", "FeatureTooltip", "UpgradeModal", "UsageProgress"]

export function Hero() {
  return (
    <header className="relative space-y-6 text-center">
      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 blur-3xl" />

      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium">
        <Sparkles className="size-4" />
        <span>Unlock features with elegant UX</span>
      </div>

      <h1 className="text-5xl font-bold leading-tight text-balance text-transparent md:text-7xl bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text">
        Feature Lock
      </h1>

      <p className="mx-auto max-w-3xl text-balance text-xl leading-relaxed text-muted-foreground md:text-2xl">
        A suite of upgrade-ready UI building blocks that help teams blur, tease, and convert users without breaking their
        flow.
      </p>

      <div className="flex flex-wrap justify-center gap-2 text-xs font-medium text-primary">
        {SUITE_BADGES.map((label) => (
          <span key={label} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
            {label}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link href="/docs">
          <Button
            size="lg"
            className="group bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => track("hero_docs_clicked")}
          >
            <BookOpen className="mr-2 size-4" />
            Documentation
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>

        <a
          href="https://github.com/gfargo/feature-lock"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("hero_github_clicked")}
        >
          <Button variant="outline" size="lg" className="border-primary/20 bg-transparent hover:bg-primary/5">
            View on GitHub
          </Button>
        </a>
      </div>
    </header>
  )
}
