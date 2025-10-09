"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Lock, Loader2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type BlurIntensity = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
type OverlayMode = "dialog" | "inline"

export type InlinePosition =
  | "leftTop"
  | "leftCenter"
  | "leftBottom"
  | "centerTop"
  | "centerCenter"
  | "centerBottom"
  | "rightTop"
  | "rightCenter"
  | "rightBottom"

export type OverlayRenderArgs = {
  isPending: boolean
  error: unknown | null
  confirm: () => void
  close: () => void
  resetError: () => void
  registerErrorRef: (el: HTMLElement | null) => void
  focusError: () => void
}

type Labels = {
  confirm: string
  pending: string
  title: string
  description: string
  error: string
  secondary?: string
  secondaryPending?: string
}

export type BlurWrapperProps = {
  // Controls
  isBlurred?: boolean
  disablePointerEvents?: boolean

  // Focus blocking
  focusInert?: boolean // apply inert+aria-hidden to subtree while blurred

  // Visuals
  blurPx?: number // overrides blurIntensity when provided
  blurIntensity?: BlurIntensity
  dimOpacity?: number // 0..1 while blurred
  className?: string
  contentClassName?: string
  testId?: string

  // Custom icon
  icon?: LucideIcon

  // Overlay behavior
  overlayMode?: OverlayMode
  overlay?: React.ReactNode | ((args: OverlayRenderArgs) => React.ReactNode)
  showOverlayOnBlur?: boolean
  // Back-compat alias (deprecated)
  showDialogOnBlur?: boolean

  // Explicit open control (applies to both modes)
  open?: boolean
  onOpenChange?: (open: boolean) => void

  // Async confirm wiring
  onConfirm?: () => Promise<void> | void
  onConfirmError?: (error: unknown) => void
  onConfirmFinally?: (result: "success" | "error") => void

  // Secondary button (optional)
  onSecondaryConfirm?: () => Promise<void> | void
  onSecondaryConfirmError?: (error: unknown) => void
  onSecondaryConfirmFinally?: (result: "success" | "error") => void

  // Labels (new) + back-compat single props
  labels?: Partial<Labels>
  confirmLabel?: string
  pendingLabel?: string
  dialogTitle?: string
  dialogDescription?: string
  errorMessage?: string
  secondaryLabel?: string
  secondaryPendingLabel?: string

  // Behavior flags
  autoCloseDialogOnConfirm?: boolean
  autoUnblurOnConfirm?: boolean
  resetErrorOnOpenChange?: boolean

  // A11y controls
  announcePending?: boolean
  focusErrorOnSet?: boolean
  returnFocusTo?: HTMLElement | string // selector or element to restore focus to after close

  // Inline overlay positioning and styling
  inlinePosition?: InlinePosition
  inlineContainerClassName?: string
  inlinePanelClassName?: string
  inlineAriaLabel?: string

  // Slot
  children: React.ReactNode

  // Unblur on success
  onUnblur?: () => void
}

const intensityToClass: Record<BlurIntensity, string> = {
  sm: "blur-sm",
  md: "blur-md",
  lg: "blur-lg",
  xl: "blur-xl",
  "2xl": "blur-2xl",
  "3xl": "blur-3xl",
}

function getPositionClasses(position: InlinePosition | undefined) {
  const value = position ?? "centerCenter"
  const map: Record<InlinePosition, { justify: string; items: string }> = {
    leftTop: { justify: "justify-start", items: "items-start" },
    leftCenter: { justify: "justify-start", items: "items-center" },
    leftBottom: { justify: "justify-start", items: "items-end" },
    centerTop: { justify: "justify-center", items: "items-start" },
    centerCenter: { justify: "justify-center", items: "items-center" },
    centerBottom: { justify: "justify-center", items: "items-end" },
    rightTop: { justify: "justify-end", items: "items-start" },
    rightCenter: { justify: "justify-end", items: "items-center" },
    rightBottom: { justify: "justify-end", items: "items-end" },
  }
  const { justify, items } = map[value]
  return `${justify} ${items}`
}

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (value: T) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === "function") ref(value)
      else (ref as React.MutableRefObject<T>).current = value
    }
  }
}

const BlurWrapper = React.forwardRef<HTMLDivElement, BlurWrapperProps>(function BlurWrapper(
  {
    isBlurred = false,
    disablePointerEvents = true,
    focusInert = true,
    blurPx,
    blurIntensity = "md",
    dimOpacity = 1,
    className,
    contentClassName,
    testId,
    icon,

    overlayMode = "dialog",
    overlay,

    showOverlayOnBlur,
    showDialogOnBlur,
    open,
    onOpenChange,

    onConfirm,
    onConfirmError,
    onConfirmFinally,

    onSecondaryConfirm,
    onSecondaryConfirmError,
    onSecondaryConfirmFinally,

    labels,
    confirmLabel = "Confirm",
    pendingLabel = "Working...",
    dialogTitle = "Feature unavailable",
    dialogDescription = "This feature is currently not accessible. You may need additional permissions or a higher plan.",
    errorMessage = "Something went wrong. Please try again.",
    secondaryLabel,
    secondaryPendingLabel = "Working...",

    autoCloseDialogOnConfirm = true,
    autoUnblurOnConfirm = true,
    resetErrorOnOpenChange = true,

    announcePending = true,
    focusErrorOnSet = true,
    returnFocusTo,

    inlinePosition = "centerCenter",
    inlineContainerClassName,
    inlinePanelClassName,
    inlineAriaLabel = "Upgrade panel",

    children,
    onUnblur,
  },
  ref,
) {
  // Normalize labels with new object while preserving old props
  const normalizedLabels: Labels = {
    confirm: labels?.confirm ?? confirmLabel,
    pending: labels?.pending ?? pendingLabel,
    title: labels?.title ?? dialogTitle,
    description: labels?.description ?? dialogDescription,
    error: labels?.error ?? errorMessage,
    secondary: labels?.secondary ?? secondaryLabel,
    secondaryPending: labels?.secondaryPending ?? secondaryPendingLabel,
  }

  // Internal controlled/uncontrolled open
  const [internalOpen, setInternalOpen] = React.useState<boolean | undefined>(undefined)
  const controlled = open !== undefined
  const shouldAutoOpen = showOverlayOnBlur ?? showDialogOnBlur ?? true
  const defaultOpen = isBlurred && shouldAutoOpen
  const effectiveOpen = controlled ? (open as boolean) : (internalOpen ?? defaultOpen)

  // Error state
  const [error, setError] = React.useState<unknown | null>(null)
  const resetError = React.useCallback(() => setError(null), [])

  // SR pending live region id
  const statusId = React.useId()

  // Focus management (restore)
  const lastActiveRef = React.useRef<HTMLElement | null>(null)
  const restoreFocus = React.useCallback(() => {
    if (typeof window === "undefined") return
    if (returnFocusTo) {
      if (typeof returnFocusTo === "string") {
        const el = document.querySelector(returnFocusTo) as HTMLElement | null
        el?.focus()
        return
      }
      returnFocusTo.focus?.()
      return
    }
    lastActiveRef.current?.focus?.()
  }, [returnFocusTo])

  // Sync uncontrolled open with blur state
  React.useEffect(() => {
    if (controlled) return
    if (defaultOpen) setInternalOpen(true)
    if (!isBlurred) setInternalOpen(false)
  }, [controlled, defaultOpen, isBlurred])

  // Track open transitions for focus capture/restore
  const prevOpenRef = React.useRef<boolean>(effectiveOpen)
  React.useEffect(() => {
    if (!prevOpenRef.current && effectiveOpen) {
      // opening now
      if (typeof document !== "undefined") {
        const active = document.activeElement
        if (active && active instanceof HTMLElement) lastActiveRef.current = active
      }
    } else if (prevOpenRef.current && !effectiveOpen) {
      // closing now
      restoreFocus()
    }
    prevOpenRef.current = effectiveOpen
  }, [effectiveOpen, restoreFocus])

  // Reset error on open changes if configured
  React.useEffect(() => {
    if (!resetErrorOnOpenChange) return
    resetError()
  }, [effectiveOpen, resetErrorOnOpenChange]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpenChange = (next: boolean) => {
    if (!controlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  // Async confirm using useTransition
  const [isPending, startTransition] = React.useTransition()
  const [isSecondaryPending, startSecondaryTransition] = React.useTransition()
  const close = () => handleOpenChange(false)

  // Error focusing refs
  const internalErrorRef = React.useRef<HTMLDivElement | null>(null)
  const externalErrorRef = React.useRef<HTMLElement | null>(null)
  const registerErrorRef = (el: HTMLElement | null) => {
    externalErrorRef.current = el ?? null
  }
  const focusError = () => {
    const target = externalErrorRef.current ?? internalErrorRef.current
    if (target) {
      setTimeout(() => {
        target.focus({ preventScroll: false })
      }, 0)
    }
  }

  const handleConfirm = () => {
    resetError()
    startTransition(async () => {
      try {
        await Promise.resolve(onConfirm?.())
        onConfirmFinally?.("success")
        if (autoUnblurOnConfirm) onUnblur?.()
        if (autoCloseDialogOnConfirm) close()
      } catch (e) {
        setError(e)
        onConfirmError?.(e)
        onConfirmFinally?.("error")
        if (focusErrorOnSet) focusError()
      }
    })
  }

  const handleSecondaryConfirm = () => {
    resetError()
    startSecondaryTransition(async () => {
      try {
        await Promise.resolve(onSecondaryConfirm?.())
        onSecondaryConfirmFinally?.("success")
        if (autoUnblurOnConfirm) onUnblur?.()
        if (autoCloseDialogOnConfirm) close()
      } catch (e) {
        setError(e)
        onSecondaryConfirmError?.(e)
        onSecondaryConfirmFinally?.("error")
        if (focusErrorOnSet) focusError()
      }
    })
  }

  // Visual styles
  const filterClass = blurPx == null ? (isBlurred ? intensityToClass[blurIntensity] : "") : ""
  const filterStyle: React.CSSProperties = blurPx != null && isBlurred ? { filter: `blur(${blurPx}px)` } : {}
  const interactionClass = isBlurred && disablePointerEvents ? "pointer-events-none select-none" : ""
  const opacityStyle: React.CSSProperties = isBlurred ? { opacity: dimOpacity } : {}

  // Focus blocking with inert
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    const el = contentRef.current
    if (!el) return
    if (isBlurred && focusInert) {
      el.setAttribute("inert", "")
      el.setAttribute("aria-hidden", "true")
    } else {
      el.removeAttribute("inert")
      el.removeAttribute("aria-hidden")
    }
  }, [isBlurred, focusInert])

  // Pending announcement for SR
  const PendingStatus = () =>
    announcePending ? (
      <div id={statusId} role="status" aria-live="polite" className="sr-only">
        {isPending ? normalizedLabels.pending : ""}
      </div>
    ) : null

  const ErrorBox = () => {
    if (!error) return null
    return (
      <div
        ref={internalErrorRef}
        role="alert"
        aria-live="assertive"
        tabIndex={-1}
        className="mt-2 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        <AlertCircle className="mt-0.5 size-4" aria-hidden={true} />
        <div>{normalizedLabels.error}</div>
      </div>
    )
  }

  const IconComponent = icon || Lock

  const renderDefaultInline = () => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <IconComponent className="size-4 text-neutral-500" aria-hidden={true} />
        <p className="text-sm font-medium">{normalizedLabels.title || "Upgrade required"}</p>
      </div>
      {normalizedLabels.description ? (
        <p className="text-sm text-muted-foreground">{normalizedLabels.description}</p>
      ) : null}
      <ErrorBox />
      {(onConfirm || onSecondaryConfirm) ? (
        <div className="flex gap-2 justify-end">
          {onSecondaryConfirm && normalizedLabels.secondary ? (
            <Button
              onClick={handleSecondaryConfirm}
              disabled={isSecondaryPending || isPending}
              aria-busy={isSecondaryPending}
              aria-describedby={announcePending ? statusId : undefined}
              variant="outline"
            >
              {isSecondaryPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden={true} />
                  {normalizedLabels.secondaryPending}
                </span>
              ) : (
                normalizedLabels.secondary
              )}
            </Button>
          ) : null}
          {onConfirm ? (
            <Button
              onClick={handleConfirm}
              disabled={isPending || isSecondaryPending}
              aria-busy={isPending}
              aria-describedby={announcePending ? statusId : undefined}
              className="bg-neutral-900 text-white hover:bg-neutral-800"
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" aria-hidden={true} />
                  {normalizedLabels.pending}
                </span>
              ) : (
                normalizedLabels.confirm
              )}
            </Button>
          ) : null}
        </div>
      ) : null}
      <PendingStatus />
    </div>
  )

  const renderOverlayContent = () => {
    if (typeof overlay === "function") {
      return overlay({
        isPending,
        error,
        confirm: handleConfirm,
        close,
        resetError,
        registerErrorRef,
        focusError,
      })
    }
    if (overlay) return overlay
    return renderDefaultInline()
  }

  // Keyboard shortcuts for inline overlay (Enter confirm, Escape close)
  const onInlineKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleConfirm()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleOpenChange(false)
    }
  }

  const InlineOverlay = effectiveOpen ? (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-10 flex",
        getPositionClasses(inlinePosition),
        inlineContainerClassName,
      )}
      aria-live="polite"
    >
      <div
        className={cn(
          "pointer-events-auto rounded-md border bg-background/95 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "w-[min(92vw,28rem)]",
          inlinePanelClassName,
        )}
        role="dialog"
        aria-label={inlineAriaLabel}
        aria-modal="false"
        tabIndex={-1}
        onKeyDown={onInlineKeyDown}
      >
        {renderOverlayContent()}
      </div>
    </div>
  ) : null

  const DialogOverlay = (
    <Dialog open={effectiveOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <PendingStatus />
        {typeof overlay === "function" || overlay ? (
          renderOverlayContent()
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <IconComponent className="size-4 text-neutral-500" aria-hidden={true} />
                {normalizedLabels.title}
              </DialogTitle>
              {normalizedLabels.description ? (
                <DialogDescription>{normalizedLabels.description}</DialogDescription>
              ) : null}
            </DialogHeader>
            <div className="px-1">
              <ErrorBox />
            </div>
            {(onConfirm || onSecondaryConfirm) ? (
              <DialogFooter className="gap-2 sm:justify-end">
                {onSecondaryConfirm && normalizedLabels.secondary ? (
                  <Button
                    onClick={handleSecondaryConfirm}
                    disabled={isSecondaryPending || isPending}
                    aria-busy={isSecondaryPending}
                    aria-describedby={announcePending ? statusId : undefined}
                    variant="outline"
                  >
                    {isSecondaryPending ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" aria-hidden={true} />
                        {normalizedLabels.secondaryPending}
                      </span>
                    ) : (
                      normalizedLabels.secondary
                    )}
                  </Button>
                ) : null}
                {onConfirm ? (
                  <Button
                    onClick={handleConfirm}
                    disabled={isPending || isSecondaryPending}
                    aria-busy={isPending}
                    aria-describedby={announcePending ? statusId : undefined}
                    className="bg-neutral-900 text-white hover:bg-neutral-800"
                  >
                    {isPending ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" aria-hidden={true} />
                        {normalizedLabels.pending}
                      </span>
                    ) : (
                      normalizedLabels.confirm
                    )}
                  </Button>
                ) : null}
              </DialogFooter>
            ) : null}
          </>
        )}
      </DialogContent>
    </Dialog>
  )

  return (
    <div
      ref={ref ? mergeRefs<HTMLDivElement>(ref) : undefined}
      className={cn("relative", className)}
      aria-disabled={isBlurred || undefined}
      data-blurred={isBlurred ? "true" : "false"}
      data-pending={isPending ? "true" : "false"}
      data-error={error ? "true" : "false"}
      data-testid={testId}
    >
      <div
        ref={contentRef}
        className={cn("transition-all duration-200", filterClass, interactionClass, contentClassName)}
        style={{ ...filterStyle, ...opacityStyle }}
      >
        {children}
      </div>

      {overlayMode === "dialog" ? DialogOverlay : InlineOverlay}
    </div>
  )
})

export default BlurWrapper
export type { Labels }
