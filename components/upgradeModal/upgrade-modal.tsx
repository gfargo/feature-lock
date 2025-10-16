"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { AlertCircle, ArrowRight, Check, Loader2, Minus } from "lucide-react"

type PlanFeature =
  | string
  | {
      label: string
      included?: boolean
      footnote?: string
    }

export type UpgradePlan = {
  id: string
  name: string
  description?: string
  price?: string
  period?: string
  badge?: string | null
  recommended?: boolean
  highlight?: string
  features?: PlanFeature[]
  footnote?: string
  ctaLabel?: string
  ctaHref?: string
  ctaPendingLabel?: string
  onSelect?: () => Promise<void> | void
  onSelectSuccess?: () => void
  onSelectError?: (error: unknown) => void
}

export type UpgradeModalProps = {
  plans: UpgradePlan[]
  trigger?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  onPlanSelected?: (planId: string) => void
  title?: string
  subtitle?: string
  description?: string
  badge?: string | null
  highlightLabel?: string
  finePrint?: string
  supportEmail?: string
  supportLabel?: string
  footer?: React.ReactNode
  autoCloseOnSelect?: boolean
  resetErrorsOnOpen?: boolean
  className?: string
  contentClassName?: string
  planCardClassName?: string
  showCloseButton?: boolean
}

function normalizeFeature(feature: PlanFeature, fallbackIncluded = true) {
  if (typeof feature === "string") {
    return {
      label: feature,
      included: fallbackIncluded,
    }
  }

  return {
    label: feature.label,
    included: feature.included ?? fallbackIncluded,
    footnote: feature.footnote,
  }
}

export const UpgradeModal = React.forwardRef<HTMLDivElement, UpgradeModalProps>(function UpgradeModal(
  {
    plans,
    trigger,
    open,
    defaultOpen,
    onOpenChange,
    onClose,
    onPlanSelected,
    title = "Unlock more with Feature Lock",
    subtitle,
    description = "Choose the plan that fits your team and start shipping premium experiences.",
    badge = "Upgrade",
    highlightLabel = "Everything in Free, plus",
    finePrint,
    supportEmail,
    supportLabel = "Need help? Reach out:",
    footer,
    autoCloseOnSelect = true,
    resetErrorsOnOpen = true,
    className,
    contentClassName,
    planCardClassName,
    showCloseButton = true,
  },
  ref,
) {
  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const [pendingPlan, setPendingPlan] = React.useState<string | null>(null)
  const [planErrors, setPlanErrors] = React.useState<Record<string, unknown>>({})

  const currentOpen = isControlled ? open : internalOpen

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next)
      }
      onOpenChange?.(next)
      if (!next) {
        onClose?.()
      }
    },
    [isControlled, onClose, onOpenChange],
  )

  React.useEffect(() => {
    if (currentOpen && resetErrorsOnOpen) {
      setPlanErrors({})
      setPendingPlan(null)
    }
  }, [currentOpen, resetErrorsOnOpen])

  const handlePlanSelect = React.useCallback(
    async (plan: UpgradePlan) => {
      if (!plan.onSelect) {
        onPlanSelected?.(plan.id)
        if (autoCloseOnSelect) {
          setOpen(false)
        }
        return
      }

      setPendingPlan(plan.id)
      setPlanErrors((prev) => ({ ...prev, [plan.id]: null }))

      try {
        const result = await plan.onSelect()
        plan.onSelectSuccess?.()
        onPlanSelected?.(plan.id)
        if (autoCloseOnSelect) {
          setOpen(false)
        }
        return result
      } catch (error) {
        setPlanErrors((prev) => ({ ...prev, [plan.id]: error }))
        plan.onSelectError?.(error)
      } finally {
        setPendingPlan(null)
      }
    },
    [autoCloseOnSelect, onPlanSelected, setOpen],
  )

  const gridColumns =
    plans.length >= 3 ? "md:grid-cols-3" : plans.length === 2 ? "md:grid-cols-2" : "md:grid-cols-1"

  return (
    <Dialog open={currentOpen} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        ref={ref}
        showCloseButton={showCloseButton}
        className={cn(
          "sm:max-w-4xl md:max-w-5xl bg-gradient-to-br from-background via-background to-background",
          className,
        )}
      >
        <DialogHeader className="space-y-4 text-left">
          {badge ? (
            <Badge variant="outline" className="w-fit border-primary/30 text-primary">
              {badge}
            </Badge>
          ) : null}
          <div className="space-y-2">
            <DialogTitle className="text-2xl sm:text-3xl font-semibold leading-tight">{title}</DialogTitle>
            {subtitle ? <p className="text-sm font-medium text-primary">{subtitle}</p> : null}
            <DialogDescription className="text-left text-base text-muted-foreground">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className={cn("space-y-6", contentClassName)}>
          <div className={cn("grid gap-4", gridColumns)}>
            {plans.map((plan) => {
              const pending = pendingPlan === plan.id
              const error = planErrors[plan.id]
              const cardClasses = cn(
                "relative flex flex-col rounded-2xl border border-primary/15 bg-card/80 p-6 shadow-sm transition-shadow",
                plan.recommended
                  ? "border-primary/40 bg-gradient-to-b from-primary/10 via-background to-background shadow-lg"
                  : "hover:shadow-md",
                planCardClassName,
              )

              return (
                <div key={plan.id} className={cardClasses}>
                  {plan.recommended ? (
                    <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Recommended
                    </span>
                  ) : null}
                  {plan.badge ? (
                    <Badge variant="outline" className="w-fit border-primary/30 text-primary mb-3 uppercase tracking-wide">
                      {plan.badge}
                    </Badge>
                  ) : null}
                  <div className="space-y-3 pb-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold text-foreground">{plan.name}</h3>
                      {plan.description ? <p className="text-sm text-muted-foreground">{plan.description}</p> : null}
                    </div>
                    {plan.price ? (
                      <div className="text-3xl font-semibold text-foreground">
                        {plan.price}
                        {plan.period ? (
                          <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                        ) : null}
                      </div>
                    ) : null}
                    {plan.highlight ? <p className="text-sm text-primary font-medium">{plan.highlight}</p> : null}
                  </div>

                  {plan.features?.length ? (
                    <div className="space-y-2 border-t border-primary/10 pt-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{highlightLabel}</p>
                      <ul className="space-y-2">
                        {plan.features.map((feature, index) => {
                          const normalized = normalizeFeature(feature)
                          const included = normalized.included !== false
                          return (
                            <li key={`${plan.id}-feature-${index}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span
                                className={cn(
                                  "mt-0.5 flex size-5 items-center justify-center rounded-full border",
                                  included
                                    ? "border-primary/40 bg-primary/10 text-primary"
                                    : "border-muted-foreground/20 text-muted-foreground",
                                )}
                                aria-hidden="true"
                              >
                                {included ? <Check className="size-3" /> : <Minus className="size-3" />}
                              </span>
                              <span>
                                {normalized.label}
                                {normalized.footnote ? (
                                  <span className="block text-xs text-muted-foreground/80">{normalized.footnote}</span>
                                ) : null}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ) : null}

                  {plan.footnote ? (
                    <p className="mt-4 text-xs text-muted-foreground/80">{plan.footnote}</p>
                  ) : null}

                  {error ? (
                    <div className="mt-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      <AlertCircle className="mt-0.5 size-4" aria-hidden="true" />
                      <span>{error instanceof Error ? error.message : "Something went wrong. Please try again."}</span>
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-col gap-2">
                    {plan.ctaHref && !plan.onSelect ? (
                      <Button asChild className="w-full">
                        <a href={plan.ctaHref} target="_blank" rel="noreferrer">
                          <span>{plan.ctaLabel ?? "Upgrade"}</span>
                          <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                        </a>
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handlePlanSelect(plan)}
                        disabled={pending}
                      >
                        {pending ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                            <span>{plan.ctaPendingLabel ?? "Working..."}</span>
                          </>
                        ) : (
                          <>
                            <span>{plan.ctaLabel ?? "Upgrade"}</span>
                            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                          </>
                        )}
                      </Button>
                    )}

                    {plan.ctaHref && plan.onSelect ? (
                      <Button variant="outline" asChild className="w-full text-sm">
                        <a href={plan.ctaHref} target="_blank" rel="noreferrer">
                          View plan details
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>

          {finePrint ? <p className="text-xs text-muted-foreground">{finePrint}</p> : null}

          {supportEmail ? (
            <div className="rounded-lg border border-primary/10 bg-primary/5 p-4 text-sm text-muted-foreground">
              <p>{supportLabel}</p>
              <a
                href={`mailto:${supportEmail}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {supportEmail}
              </a>
            </div>
          ) : null}
        </div>

        {footer ? <DialogFooter className="pt-4">{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  )
})

UpgradeModal.displayName = "UpgradeModal"

export const UpgradeModalTrigger = DialogTrigger
export const UpgradeModalClose = DialogClose
