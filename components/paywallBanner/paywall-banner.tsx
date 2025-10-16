"use client"

import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { Megaphone, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export type PaywallBannerVariant = "upgrade" | "info" | "success" | "warning"

type VariantConfig = {
  container: string
  iconWrapper: string
  accentText: string
  badgeClassName: string
}

const variantConfig: Record<PaywallBannerVariant, VariantConfig> = {
  upgrade: {
    container: "border border-primary/20 bg-primary/10",
    iconWrapper: "bg-primary/15 text-primary shadow-sm shadow-primary/20",
    accentText: "text-primary",
    badgeClassName: "bg-primary text-primary-foreground",
  },
  info: {
    container: "border border-blue-500/20 bg-blue-500/10 dark:border-blue-400/25 dark:bg-blue-500/5",
    iconWrapper: "bg-blue-500/15 text-blue-600 dark:text-blue-400 shadow-sm shadow-blue-500/20",
    accentText: "text-blue-600 dark:text-blue-400",
    badgeClassName: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  },
  success: {
    container: "border border-emerald-500/20 bg-emerald-500/10 dark:border-emerald-400/25 dark:bg-emerald-500/5",
    iconWrapper: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/20",
    accentText: "text-emerald-600 dark:text-emerald-400",
    badgeClassName: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  },
  warning: {
    container: "border border-amber-500/30 bg-amber-500/10 dark:border-amber-400/35 dark:bg-amber-500/5",
    iconWrapper: "bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-sm shadow-amber-500/20",
    accentText: "text-amber-700 dark:text-amber-400",
    badgeClassName: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  },
}

export type PaywallBannerProps = {
  title: string
  description?: string
  badge?: string | null
  icon?: LucideIcon
  variant?: PaywallBannerVariant
  ctaLabel?: string
  ctaHref?: string
  ctaPendingLabel?: string
  onCtaClick?: () => Promise<void> | void
  onCtaSuccess?: () => void
  onCtaError?: (error: unknown) => void
  secondaryLabel?: string
  secondaryHref?: string
  onSecondaryClick?: () => Promise<void> | void
  onSecondarySuccess?: () => void
  onSecondaryError?: (error: unknown) => void
  dismissible?: boolean
  dismissLabel?: string
  onDismiss?: () => void
  storageKey?: string
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  errorMessage?: string
  showDivider?: boolean
  className?: string
  contentClassName?: string
  actionsClassName?: string
  children?: React.ReactNode
}

export const PaywallBanner = React.forwardRef<HTMLDivElement, PaywallBannerProps>(
  function PaywallBanner(
    {
      title,
      description,
      badge = "New",
      icon: Icon = Megaphone,
      variant = "upgrade",
      ctaLabel = "Upgrade now",
      ctaHref,
      ctaPendingLabel = "Working...",
      onCtaClick,
      onCtaSuccess,
      onCtaError,
      secondaryLabel,
      secondaryHref,
      onSecondaryClick,
      onSecondarySuccess,
      onSecondaryError,
      dismissible = true,
      dismissLabel = "Dismiss banner",
      onDismiss,
      storageKey,
      defaultOpen = true,
      open,
      onOpenChange,
      errorMessage = "Something went wrong. Please try again.",
      showDivider = false,
      className,
      contentClassName,
      actionsClassName,
      children,
    },
    ref,
  ) {
    const isControlled = open !== undefined
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const [ctaPending, setCtaPending] = React.useState(false)
    const [secondaryPending, setSecondaryPending] = React.useState(false)
    const [ctaError, setCtaError] = React.useState<unknown>(null)
    const [hydrated, setHydrated] = React.useState(!storageKey)

    React.useEffect(() => {
      if (!storageKey) return
      if (typeof window === "undefined") return

      try {
        const stored = window.localStorage.getItem(storageKey)
        if (!isControlled && stored === "dismissed") {
          setInternalOpen(false)
        }
      } finally {
        setHydrated(true)
      }
    }, [isControlled, storageKey])

    const isOpen = isControlled ? open! : internalOpen

    const config = variantConfig[variant]

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) {
          setInternalOpen(next)
        }
        onOpenChange?.(next)
      },
      [isControlled, onOpenChange],
    )

    const handleDismiss = React.useCallback(() => {
      setOpen(false)
      if (storageKey && typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, "dismissed")
      }
      onDismiss?.()
    }, [onDismiss, setOpen, storageKey])

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

    const handleSecondaryClick = React.useCallback(async () => {
      if (!onSecondaryClick) return
      setSecondaryPending(true)
      try {
        await onSecondaryClick()
        onSecondarySuccess?.()
      } catch (error) {
        onSecondaryError?.(error)
      } finally {
        setSecondaryPending(false)
      }
    }, [onSecondaryClick, onSecondaryError, onSecondarySuccess])

    if (!isOpen || !hydrated) {
      return null
    }

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className={cn(
          "relative overflow-hidden rounded-2xl border px-5 py-4 shadow-sm backdrop-blur-sm transition-all",
          config.container,
          className,
        )}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-1 items-start gap-4">
            <span
              className={cn(
                "flex size-12 items-center justify-center rounded-xl border border-transparent",
                config.iconWrapper,
              )}
              aria-hidden="true"
            >
              <Icon className="size-6" />
            </span>

            <div className={cn("flex-1 space-y-2 text-sm text-muted-foreground", contentClassName)}>
              {badge ? (
                <Badge className={cn("uppercase tracking-wide", config.badgeClassName)}>{badge}</Badge>
              ) : null}

              <div className="space-y-1 text-foreground">
                <p className={cn("text-base font-semibold leading-tight", config.accentText)}>{title}</p>
                {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
              </div>

              {children ? <div className="text-sm text-muted-foreground">{children}</div> : null}

              {ctaError ? (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                  {ctaError instanceof Error ? ctaError.message : errorMessage}
                </div>
              ) : null}
            </div>
          </div>

          <div
            className={cn(
              "flex w-full flex-col gap-2 border-t border-primary/10 pt-4 pr-8 md:w-auto md:flex-shrink-0 md:flex-row md:items-center md:gap-3 md:border-0 md:pt-0",
              showDivider && "md:border-l md:pl-4",
              actionsClassName,
            )}
          >
            {ctaLabel ? (
              ctaHref && !onCtaClick ? (
                <Button asChild>
                  <a href={ctaHref} target="_blank" rel="noreferrer">
                    {ctaLabel}
                  </a>
                </Button>
              ) : (
                <Button onClick={handleCtaClick} disabled={ctaPending}>
                  {ctaPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      {ctaPendingLabel}
                    </>
                  ) : (
                    ctaLabel
                  )}
                </Button>
              )
            ) : null}

            {secondaryLabel ? (
              secondaryHref && !onSecondaryClick ? (
                <Button variant="outline" asChild>
                  <a href={secondaryHref} target="_blank" rel="noreferrer">
                    {secondaryLabel}
                  </a>
                </Button>
              ) : (
                <Button variant="outline" onClick={handleSecondaryClick} disabled={secondaryPending}>
                  {secondaryPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                      Working...
                    </>
                  ) : (
                    secondaryLabel
                  )}
                </Button>
              )
            ) : null}
          </div>
        </div>

        {dismissible ? (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
            onClick={handleDismiss}
            aria-label={dismissLabel}
          >
            <X className="size-4" aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    )
  },
) 

PaywallBanner.displayName = "PaywallBanner"
