"use client"

import * as React from "react"
import type { TooltipContentProps } from "@radix-ui/react-tooltip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ArrowRight, CheckCircle2, Loader2, Lock } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type HighlightItem =
  | string
  | {
      icon?: LucideIcon
      label: string
    }

export type FeatureTooltipProps = {
  children: React.ReactNode
  title: string
  description?: string
  badge?: string | null
  icon?: LucideIcon
  highlights?: HighlightItem[]
  ctaLabel?: string
  ctaHref?: string
  ctaPendingLabel?: string
  onCtaClick?: () => Promise<void> | void
  onCtaSuccess?: () => void
  onCtaError?: (error: unknown) => void
  side?: TooltipContentProps["side"]
  align?: TooltipContentProps["align"]
  sideOffset?: number
  delayDuration?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  className?: string
  contentClassName?: string
  badgeClassName?: string
  highlightIcon?: LucideIcon
}

export const FeatureTooltip = React.forwardRef<HTMLDivElement, FeatureTooltipProps>(function FeatureTooltip(
  {
    children,
    title,
    description,
    badge = "Upgrade to unlock",
    icon: Icon = Lock,
    highlights,
    highlightIcon = CheckCircle2,
    ctaLabel = "Upgrade",
    ctaHref,
    ctaPendingLabel = "Working...",
    onCtaClick,
    onCtaSuccess,
    onCtaError,
    side = "top",
    align = "center",
    sideOffset = 12,
    delayDuration = 200,
    open,
    defaultOpen,
    onOpenChange,
    disabled = false,
    className,
    contentClassName,
    badgeClassName,
  },
  ref,
) {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const [ctaPending, setCtaPending] = React.useState(false)
  const [ctaError, setCtaError] = React.useState<unknown>(null)

  React.useEffect(() => {
    if (!isControlled && defaultOpen !== undefined) {
      setInternalOpen(defaultOpen)
    }
  }, [defaultOpen, isControlled])

  const currentOpen = isControlled ? open : internalOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next)
      }
      onOpenChange?.(next)
    },
    [isControlled, onOpenChange],
  )

  const handleCta = React.useCallback(async () => {
    if (!onCtaClick) return
    setCtaPending(true)
    setCtaError(null)
    try {
      await onCtaClick()
      onCtaSuccess?.()
      setOpen(false)
    } catch (error) {
      setCtaError(error)
      onCtaError?.(error)
    } finally {
      setCtaPending(false)
    }
  }, [onCtaClick, onCtaError, onCtaSuccess, setOpen])

  const normalizedHighlights = React.useMemo(() => {
    if (!highlights?.length) return []
    return highlights.map((item) =>
      typeof item === "string"
        ? {
            icon: highlightIcon,
            label: item,
          }
        : {
            icon: item.icon ?? highlightIcon,
            label: item.label,
          },
    )
  }, [highlightIcon, highlights])

  if (disabled) {
    return <>{children}</>
  }

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip
        open={currentOpen}
        onOpenChange={(next) => {
          setOpen(next)
        }}
      >
        <TooltipTrigger asChild>
          <span className={cn("inline-flex items-center gap-2 text-left", className)}>{children}</span>
        </TooltipTrigger>
        <TooltipContent
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "flex max-w-sm gap-3 rounded-2xl border border-primary/20 bg-background/95 p-4 text-left shadow-lg backdrop-blur-md",
            contentClassName,
          )}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div className="space-y-2">
                {badge ? (
                  <Badge className={cn("uppercase tracking-wide", badgeClassName)} variant="outline">
                    {badge}
                  </Badge>
                ) : null}
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
                </div>
              </div>
            </div>

            {normalizedHighlights.length ? (
              <ul className="space-y-1 pl-0">
                {normalizedHighlights.map((item, index) => {
                  const ItemIcon = item.icon
                  return (
                    <li key={`${item.label}-${index}`} className="flex items-center gap-2 text-xs text-muted-foreground">
                      {ItemIcon ? <ItemIcon className="size-3 text-primary" aria-hidden="true" /> : null}
                      <span>{item.label}</span>
                    </li>
                  )
                })}
              </ul>
            ) : null}

            {ctaError ? (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {ctaError instanceof Error ? ctaError.message : "Something went wrong. Please try again."}
              </div>
            ) : null}

            {(ctaHref && !onCtaClick) || onCtaClick ? (
              <div className="flex items-center gap-2">
                {ctaHref && !onCtaClick ? (
                  <Button size="sm" asChild>
                    <a href={ctaHref} target="_blank" rel="noreferrer">
                      <span>{ctaLabel}</span>
                      <ArrowRight className="ml-1 size-3" aria-hidden="true" />
                    </a>
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleCta} disabled={ctaPending}>
                    {ctaPending ? (
                      <>
                        <Loader2 className="size-3 animate-spin" aria-hidden="true" />
                        {ctaPendingLabel}
                      </>
                    ) : (
                      <>
                        {ctaLabel}
                        <ArrowRight className="ml-1 size-3" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                )}
                {ctaHref && onCtaClick ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href={ctaHref} target="_blank" rel="noreferrer">
                      Details
                    </a>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})

FeatureTooltip.displayName = "FeatureTooltip"
