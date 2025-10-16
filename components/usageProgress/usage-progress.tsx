"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressBar } from "./usage-progress-bar"
import { ArrowRight, Info } from "lucide-react"

type UsageTrend = "up" | "down" | "steady"

export type UsageTrack = {
  label: string
  value: number
  limit?: number
  percentage?: number
  status?: "ok" | "warning" | "critical"
  badge?: string
  trend?: UsageTrend
  description?: string
}

export type UsageProgressProps = {
  title?: string
  subtitle?: string
  tracks: UsageTrack[]
  variant?: "card" | "inline"
  showSummary?: boolean
  summaryLabel?: string
  summaryValue?: string
  summaryMessage?: string
  ctaLabel?: string
  ctaHref?: string
  ctaPendingLabel?: string
  onCtaClick?: () => Promise<void> | void
  onCtaSuccess?: () => void
  onCtaError?: (error: unknown) => void
  secondaryLabel?: string
  onSecondaryClick?: () => void
  footer?: React.ReactNode
  className?: string
  trackClassName?: string
  summaryClassName?: string
  footerClassName?: string
  pending?: boolean
  note?: string
}

function getStatusClasses(status: UsageTrack["status"]) {
  switch (status) {
    case "ok":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
    case "warning":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20"
    case "critical":
      return "text-red-500 bg-red-500/10 border-red-500/20"
    default:
      return "text-muted-foreground bg-muted/40 border-muted/30"
  }
}

function calculatePercentage(track: UsageTrack) {
  if (track.percentage !== undefined) return Math.min(100, Math.max(0, track.percentage))
  if (track.limit === undefined || track.limit === 0) return 0
  return Math.min(100, Math.max(0, Math.round((track.value / track.limit) * 100)))
}

function getTrendLabel(trend?: UsageTrend) {
  switch (trend) {
    case "up":
      return "↑"
    case "down":
      return "↓"
    case "steady":
      return "→"
    default:
      return ""
  }
}

export function UsageProgress({
  title = "Usage overview",
  subtitle = "Stay on top of quota limits and see when to upgrade.",
  tracks,
  variant = "card",
  showSummary = true,
  summaryLabel = "Upgrade unlocks",
  summaryValue,
  summaryMessage,
  ctaLabel = "Upgrade plan",
  ctaHref,
  ctaPendingLabel = "Working...",
  onCtaClick,
  onCtaSuccess,
  onCtaError,
  secondaryLabel,
  onSecondaryClick,
  footer,
  note,
  className,
  trackClassName,
  summaryClassName,
  footerClassName,
  pending = false,
}: UsageProgressProps) {
  const [ctaPending, setCtaPending] = React.useState(false)
  const [ctaError, setCtaError] = React.useState<unknown>(null)

  React.useEffect(() => {
    if (!pending) {
      setCtaPending(false)
    }
  }, [pending])

  const handleCtaClick = React.useCallback(async () => {
    if (!onCtaClick) return
    setCtaPending(true)
    setCtaError(null)

    try {
      await onCtaClick()
      onCtaSuccess?.()
    } catch (error) {
      setCtaError(error)
      onCtaError?.(error)
    } finally {
      setCtaPending(false)
    }
  }, [onCtaClick, onCtaError, onCtaSuccess])

  const Wrapper = variant === "card" ? "div" : "section"

  return (
    <Wrapper
      className={cn(
        "w-full rounded-2xl border border-primary/10 bg-card/80 p-6 shadow-sm backdrop-blur-sm",
        variant === "card" && "space-y-6",
        className,
      )}
    >
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </header>

      <div className={cn("space-y-4", trackClassName)}>
        {tracks.map((track) => {
          const percentage = calculatePercentage(track)
          const statusClasses = getStatusClasses(track.status)
          const trendLabel = getTrendLabel(track.trend)
          const limitLabel = track.limit !== undefined ? ` / ${track.limit.toLocaleString()}` : ""

          return (
            <article
              key={track.label}
              className="rounded-xl border border-primary/15 bg-background/60 p-4 shadow-xs transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{track.label}</p>
                  {track.description ? <p className="text-xs text-muted-foreground">{track.description}</p> : null}
                </div>
                <div className="flex items-center gap-3">
                  {track.badge ? (
                    <Badge variant="outline" className={cn("text-xs", statusClasses)}>
                      {track.badge}
                    </Badge>
                  ) : null}
                  <p className="text-sm font-semibold text-foreground">
                    {track.value.toLocaleString()}
                    {limitLabel}
                    {trendLabel ? <span className="ml-1 text-muted-foreground">{trendLabel}</span> : null}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar percentage={percentage} status={track.status} />
              </div>
            </article>
          )
        })}
      </div>

      {showSummary ? (
        <div
          className={cn(
            "rounded-xl border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
            summaryClassName,
          )}
        >
          <div className="flex items-start gap-2">
            <Info className="mt-0.5 size-4 text-primary" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">{summaryLabel}</p>
              {summaryMessage ? <p className="text-xs text-muted-foreground">{summaryMessage}</p> : null}
            </div>
          </div>
          {summaryValue ? <p className="text-sm font-semibold text-primary">{summaryValue}</p> : null}
        </div>
      ) : null}

      {ctaError ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {ctaError instanceof Error ? ctaError.message : "Something went wrong. Please try again."}
        </p>
      ) : null}

      {(ctaHref || onCtaClick || secondaryLabel) && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            {ctaHref && !onCtaClick ? (
              <Button asChild disabled={pending}>
                <a href={ctaHref} target="_blank" rel="noreferrer">
                  {ctaLabel}
                </a>
              </Button>
            ) : (
              <Button onClick={handleCtaClick} disabled={ctaPending || pending} aria-busy={ctaPending || pending}>
                {ctaPending || pending ? (
                  <span>{ctaPendingLabel}</span>
                ) : (
                  <>
                    {ctaLabel}
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            )}
            {secondaryLabel ? (
              <Button variant="outline" onClick={onSecondaryClick} disabled={pending}>
                {secondaryLabel}
              </Button>
            ) : null}
          </div>
          {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
        </div>
      )}

      {footer ? <div className={cn("pt-4 border-t border-primary/10", footerClassName)}>{footer}</div> : null}
    </Wrapper>
  )
}
