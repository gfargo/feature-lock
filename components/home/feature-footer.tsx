"use client"

import Link from "next/link"
import { track } from "@vercel/analytics"

const NAV_LINKS = [
  { label: "Home", href: "/", trackId: "footer_home_clicked" },
  { label: "Docs", href: "/docs", trackId: "footer_docs_clicked" },
  { label: "Registry", href: "https://feature-lock.griffen.codes/api/registry", trackId: "footer_registry_clicked" },
  { label: "GitHub", href: "https://github.com/gfargo/feature-lock", trackId: "footer_github_clicked", external: true },
]

export function FeatureFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <nav className="flex items-center space-x-4 text-sm font-medium text-muted-foreground">
          {NAV_LINKS.map((link) => {
            const handleClick = () => track(link.trackId)

            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClick}
                  className="transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              )
            }

            return (
              <Link key={link.label} href={link.href} onClick={handleClick} className="transition-colors hover:text-primary">
                {link.label}
              </Link>
            )
          })}
        </nav>

        <p className="text-xs text-muted-foreground sm:text-sm">
          © {year} Feature Lock by{" "}
          <a
            href="https://github.com/gfargo/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
            onClick={() => track("footer_author_clicked")}
          >
            gfargo
          </a>
          {" "}· Built with ❤️ by{" "}
          <a
            href="https://griffen.codes"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
            onClick={() => track("footer_studio_clicked")}
          >
            griffen.codes
          </a>
        </p>
      </div>
    </footer>
  )
}
