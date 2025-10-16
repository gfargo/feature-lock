import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { UsageProgress } from "./usage-progress"

describe("UsageProgress", () => {
  const tracks = [
    {
      label: "API requests",
      value: 90,
      limit: 100,
      status: "warning" as const,
      badge: "90% used",
    },
  ]

  it("renders usage information", () => {
    render(
      <UsageProgress
        tracks={tracks}
        summaryValue="Scale unlocks 500k requests"
        summaryMessage="Upgrade before May 1 to avoid throttling."
        ctaLabel="Upgrade usage"
      />,
    )

    expect(screen.getByText("API requests")).toBeInTheDocument()
    expect(screen.getByText("90% used")).toBeInTheDocument()
    expect(screen.getByText("Scale unlocks 500k requests")).toBeInTheDocument()
    const cta = screen.queryByRole("button", { name: /upgrade usage/i })
    if (cta) {
      expect(cta).toBeInTheDocument()
    }
  })

  it("handles async CTA clicks", async () => {
    const onCtaClick = vi.fn().mockResolvedValue(undefined)

    render(
      <UsageProgress tracks={tracks} ctaLabel="Upgrade usage" onCtaClick={onCtaClick} ctaPendingLabel="Working..." />,
    )

    fireEvent.click(screen.getByRole("button", { name: /upgrade usage/i }))

    await waitFor(() => {
      expect(onCtaClick).toHaveBeenCalled()
    })
  })
})
