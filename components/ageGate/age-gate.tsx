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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, Shield } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type AgeVerificationMethod = "birthdate" | "simple" | "custom"

export type AgeGateLabels = {
  title: string
  description: string
  confirm: string
  pending: string
  cancel: string
  error: string
  birthdateLabel: string
  birthdatePlaceholder: string
  simpleConfirm: string
  simpleCancel: string
  rememberChoice: string
}

export type CustomVerificationRenderArgs = {
  isPending: boolean
  error: unknown | null
  onVerify: (verified: boolean) => void
  resetError: () => void
  registerErrorRef: (el: HTMLElement | null) => void
  focusError: () => void
}

export type StorageType = "localStorage" | "sessionStorage" | "cookie"

export type CookieOptions = {
  domain?: string
  path?: string
  secure?: boolean
  sameSite?: "strict" | "lax" | "none"
  maxAge?: number // in seconds
  expires?: Date
}

export type AgeGateProps = {
  // Core behavior
  open?: boolean
  onOpenChange?: (open: boolean) => void
  minimumAge?: number
  method?: AgeVerificationMethod
  
  // Persistence
  rememberVerification?: boolean
  storageKey?: string
  storageType?: StorageType
  cookieOptions?: CookieOptions
  
  // Callbacks
  onVerified?: (age?: number) => Promise<void> | void
  onDenied?: () => Promise<void> | void
  onError?: (error: unknown) => void
  
  // Custom verification
  customVerification?: (args: CustomVerificationRenderArgs) => React.ReactNode
  
  // Custom content
  children?: React.ReactNode
  
  // Styling
  className?: string
  icon?: LucideIcon
  
  // Labels
  labels?: Partial<AgeGateLabels>
  
  // Behavior
  allowCancel?: boolean
  autoCloseOnVerify?: boolean
  resetErrorOnOpenChange?: boolean
  focusErrorOnSet?: boolean
  
  // A11y
  announcePending?: boolean
  
  // Testing
  testId?: string
}

const defaultLabels: AgeGateLabels = {
  title: "Age Verification Required",
  description: "Please verify your age to continue.",
  confirm: "Verify Age",
  pending: "Verifying...",
  cancel: "Cancel",
  error: "Age verification failed. Please check your information and try again.",
  birthdateLabel: "Date of Birth",
  birthdatePlaceholder: "MM/DD/YYYY",
  simpleConfirm: "I am 18 or older",
  simpleCancel: "I am under 18",
  rememberChoice: "Remember my choice",
}

function calculateAge(birthDate: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return date instanceof Date && !isNaN(date.getTime())
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue || null
  }
  return null
}

function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === "undefined") return
  
  let cookieString = `${name}=${value}`
  
  if (options.maxAge !== undefined) {
    cookieString += `; Max-Age=${options.maxAge}`
  }
  
  if (options.expires) {
    cookieString += `; Expires=${options.expires.toUTCString()}`
  }
  
  if (options.domain) {
    cookieString += `; Domain=${options.domain}`
  }
  
  if (options.path) {
    cookieString += `; Path=${options.path}`
  } else {
    cookieString += `; Path=/`
  }
  
  if (options.secure) {
    cookieString += `; Secure`
  }
  
  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`
  }
  
  document.cookie = cookieString
}

function getStoredVerification(storageKey: string, storageType: StorageType): boolean | null {
  if (typeof window === "undefined") return null
  
  try {
    if (storageType === "cookie") {
      const cookieValue = getCookie(storageKey)
      return cookieValue ? JSON.parse(cookieValue) : null
    }
    
    const storage = storageType === "sessionStorage" ? sessionStorage : localStorage
    const stored = storage.getItem(storageKey)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function setStoredVerification(
  storageKey: string, 
  verified: boolean, 
  storageType: StorageType,
  cookieOptions?: CookieOptions
): void {
  if (typeof window === "undefined") return
  
  try {
    if (storageType === "cookie") {
      const defaultCookieOptions: CookieOptions = {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
        sameSite: "lax",
        ...cookieOptions
      }
      setCookie(storageKey, JSON.stringify(verified), defaultCookieOptions)
      return
    }
    
    const storage = storageType === "sessionStorage" ? sessionStorage : localStorage
    storage.setItem(storageKey, JSON.stringify(verified))
  } catch {
    // Silently fail if storage is not available
  }
}

const AgeGate = React.forwardRef<HTMLDivElement, AgeGateProps>(function AgeGate(
  {
    open,
    onOpenChange,
    minimumAge = 18,
    method = "simple",
    
    rememberVerification = false,
    storageKey = "age-gate-verified",
    storageType = "localStorage",
    cookieOptions,
    
    onVerified,
    onDenied,
    onError,
    
    customVerification,
    children,
    
    className,
    icon,
    
    labels,
    
    allowCancel = true,
    autoCloseOnVerify = true,
    resetErrorOnOpenChange = true,
    focusErrorOnSet = true,
    
    announcePending = true,
    
    testId,
  },
  ref,
) {
  const normalizedLabels: AgeGateLabels = { ...defaultLabels, ...labels }
  
  // Internal state
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [birthdate, setBirthdate] = React.useState("")
  const [rememberChoice, setRememberChoice] = React.useState(false)
  const [error, setError] = React.useState<unknown | null>(null)
  
  // Controlled vs uncontrolled
  const controlled = open !== undefined
  const effectiveOpen = controlled ? open : internalOpen
  
  // Check stored verification on mount
  React.useEffect(() => {
    if (!rememberVerification) return
    
    const stored = getStoredVerification(storageKey, storageType)
    if (stored === true) {
      // Already verified, don't show dialog
      if (!controlled) setInternalOpen(false)
      return
    }
    
    // Not verified or no stored value, show dialog if not controlled
    if (!controlled && stored === null) {
      setInternalOpen(true)
    }
  }, [rememberVerification, storageKey, storageType, controlled])
  
  // Async operations using useTransition
  const [isPending, startTransition] = React.useTransition()
  
  // Error management
  const resetError = React.useCallback(() => setError(null), [])
  
  // Reset error on open changes if configured
  React.useEffect(() => {
    if (!resetErrorOnOpenChange) return
    resetError()
  }, [effectiveOpen, resetErrorOnOpenChange, resetError])
  
  // SR pending live region id
  const statusId = React.useId()
  
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
  
  const handleOpenChange = (nextOpen: boolean) => {
    if (!controlled) setInternalOpen(nextOpen)
    onOpenChange?.(nextOpen)
  }
  
  const handleVerification = (verified: boolean, age?: number) => {
    resetError()
    startTransition(() => {
      Promise.resolve().then(async () => {
        try {
          if (verified) {
            // Store verification if remember is enabled
            if (rememberVerification && rememberChoice) {
              setStoredVerification(storageKey, true, storageType, cookieOptions)
            }
            
            await Promise.resolve(onVerified?.(age))
            
            if (autoCloseOnVerify) {
              handleOpenChange(false)
            }
          } else {
            await Promise.resolve(onDenied?.())
            
            if (autoCloseOnVerify) {
              handleOpenChange(false)
            }
          }
        } catch (e) {
          setError(e)
          onError?.(e)
          if (focusErrorOnSet) focusError()
        }
      })
    })
  }
  
  const handleBirthdateVerification = () => {
    if (!birthdate.trim()) {
      setError(new Error("Please enter your date of birth"))
      if (focusErrorOnSet) focusError()
      return
    }
    
    if (!isValidDate(birthdate)) {
      setError(new Error("Please enter a valid date"))
      if (focusErrorOnSet) focusError()
      return
    }
    
    const birthDate = new Date(birthdate)
    const age = calculateAge(birthDate)
    const verified = age >= minimumAge
    
    handleVerification(verified, age)
  }
  
  const handleSimpleVerification = (verified: boolean) => {
    handleVerification(verified)
  }
  
  const IconComponent = icon || Shield
  
  // Pending announcement for SR
  const PendingStatus = () =>
    announcePending ? (
      <div id={statusId} role="status" aria-live="polite" className="sr-only">
        {isPending ? normalizedLabels.pending : ""}
      </div>
    ) : null
  
  const ErrorBox = () => {
    if (!error) return null
    const message = error instanceof Error ? error.message : normalizedLabels.error
    
    return (
      <div
        ref={internalErrorRef}
        role="alert"
        aria-live="assertive"
        tabIndex={-1}
        className="mt-2 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        <AlertCircle className="mt-0.5 size-4" aria-hidden={true} />
        <div>{message}</div>
      </div>
    )
  }
  
  const renderBirthdateMethod = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="birthdate">{normalizedLabels.birthdateLabel}</Label>
        <Input
          id="birthdate"
          type="date"
          value={birthdate}
          onChange={(e) => setBirthdate(e.target.value)}
          placeholder={normalizedLabels.birthdatePlaceholder}
          disabled={isPending}
          className="w-full"
        />
      </div>
      
      {rememberVerification && (
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            checked={rememberChoice}
            onChange={(e) => setRememberChoice(e.target.checked)}
            disabled={isPending}
            className="rounded border-gray-300"
          />
          <Label htmlFor="remember" className="text-sm">
            {normalizedLabels.rememberChoice}
          </Label>
        </div>
      )}
      
      <ErrorBox />
    </div>
  )
  
  const renderSimpleMethod = () => (
    <div className="space-y-4">
      {rememberVerification && (
        <div className="flex items-center space-x-2">
          <input
            id="remember"
            type="checkbox"
            checked={rememberChoice}
            onChange={(e) => setRememberChoice(e.target.checked)}
            disabled={isPending}
            className="rounded border-gray-300"
          />
          <Label htmlFor="remember" className="text-sm">
            {normalizedLabels.rememberChoice}
          </Label>
        </div>
      )}
      
      <ErrorBox />
    </div>
  )
  
  const renderCustomMethod = () => {
    if (!customVerification) return null
    
    return customVerification({
      isPending,
      error,
      onVerify: handleVerification,
      resetError,
      registerErrorRef,
      focusError,
    })
  }
  
  const renderFooter = () => {
    if (method === "custom") return null
    
    if (method === "simple") {
      return (
        <DialogFooter className="gap-2 sm:justify-center">
          {allowCancel && (
            <Button
              onClick={() => handleSimpleVerification(false)}
              disabled={isPending}
              variant="outline"
              aria-describedby={announcePending ? statusId : undefined}
            >
              {normalizedLabels.simpleCancel}
            </Button>
          )}
          <Button
            onClick={() => handleSimpleVerification(true)}
            disabled={isPending}
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
              normalizedLabels.simpleConfirm
            )}
          </Button>
        </DialogFooter>
      )
    }
    
    if (method === "birthdate") {
      return (
        <DialogFooter className="gap-2 sm:justify-end">
          {allowCancel && (
            <Button
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
              variant="outline"
            >
              {normalizedLabels.cancel}
            </Button>
          )}
          <Button
            onClick={handleBirthdateVerification}
            disabled={isPending}
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
        </DialogFooter>
      )
    }
    
    return null
  }
  
  return (
    <div
      ref={ref}
      className={cn("", className)}
      data-testid={testId}
    >
      <Dialog open={effectiveOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <PendingStatus />
          
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconComponent className="size-4 text-neutral-500" aria-hidden={true} />
              {normalizedLabels.title}
            </DialogTitle>
            <DialogDescription>
              {normalizedLabels.description}
            </DialogDescription>
          </DialogHeader>
          
          {children && (
            <div className="px-1 py-2 border-t border-b border-gray-100">
              {children}
            </div>
          )}
          
          <div className="px-1">
            {method === "birthdate" && renderBirthdateMethod()}
            {method === "simple" && renderSimpleMethod()}
            {method === "custom" && renderCustomMethod()}
          </div>
          
          {renderFooter()}
        </DialogContent>
      </Dialog>
    </div>
  )
})

export default AgeGate