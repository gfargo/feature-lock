"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function DocsHeader() {
  return (
    <header className="space-y-6">
      <Button
        variant="ghost"
        className="-ml-4 text-primary hover:text-primary/80 hover:bg-primary/5 mb-6"
        onClick={() => track("docs_back_clicked")}
        asChild
      >
        <Link href="/">
          <ArrowLeft className="mr-2 size-4" />
          Back to home
        </Link>
      </Button>

      <div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent mb-4">
          Documentation
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Complete guide to installing BlurWrapper, PaywallBanner,
          FeatureTooltip, UpgradeModal, and UsageProgress in your Next.js
          project
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant="outline"
          className="border-primary/20"
        >
          React 19
        </Badge>
        <Badge
          variant="outline"
          className="border-primary/20"
        >
          Next.js 14+
        </Badge>
        <Badge
          variant="outline"
          className="border-primary/20"
        >
          TypeScript
        </Badge>
        <Badge
          variant="outline"
          className="border-primary/20"
        >
          shadcn/ui
        </Badge>
      </div>
    </header>
  );
}
