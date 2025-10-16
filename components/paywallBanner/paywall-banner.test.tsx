import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { PaywallBanner } from "./paywall-banner"

describe("PaywallBanner", () => {
  it("renders content and handles primary CTA", async () => {
    const onCtaClick = vi.fn().mockResolvedValue(undefined)

    render(
      <PaywallBanner
        open
        title="New analytics launch"
        description="Upgrade to unlock team-wide dashboards."
        ctaLabel="Upgrade now"
        onCtaClick={onCtaClick}
        onCtaSuccess={vi.fn()}
      />,
    )

    expect(screen.getByText(/New analytics launch/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: /upgrade now/i }))

    await waitFor(() => expect(onCtaClick).toHaveBeenCalledTimes(1))
  })

  it("triggers dismiss callback", () => {
    const onDismiss = vi.fn()

    render(
      <PaywallBanner
        open
        title="New feature"
        ctaLabel="See plans"
        onDismiss={onDismiss}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /dismiss banner/i }))

    expect(onDismiss).toHaveBeenCalled()
  })
})
