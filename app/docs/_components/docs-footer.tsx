"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

import { Button } from "@/components/ui/button";

export function DocsFooter() {
  return (
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
  );
}
