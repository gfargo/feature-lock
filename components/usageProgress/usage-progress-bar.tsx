"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ProgressBarProps = {
  percentage: number
  status?: "ok" | "warning" | "critical"
  className?: string
}

export function ProgressBar({ percentage, status = "ok", className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage))

  const statusClasses = {
    ok: "bg-emerald-500",
    warning: "bg-amber-500",
    critical: "bg-red-500",
  }[status]

  return (
    <div className={cn("h-2 w-full rounded-full bg-muted overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500 ease-out", statusClasses)}
        style={{ width: `${clamped}%` }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}
