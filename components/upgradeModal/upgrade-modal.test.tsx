import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { UpgradeModal } from "./upgrade-modal"

describe("UpgradeModal", () => {
  const plans = [
    {
      id: "growth",
      name: "Growth",
      description: "Unlock team-wide automation",
      price: "$79",
      period: "month",
      features: ["Unlimited dashboards"],
      ctaLabel: "Upgrade to Growth",
      onSelect: vi.fn().mockResolvedValue(undefined),
    },
  ]

  it("renders plans when open", () => {
    render(
      <UpgradeModal
        open
        onOpenChange={vi.fn()}
        title="Upgrade"
        subtitle="Scale faster"
        plans={plans}
      />,
    )

    expect(screen.getByText(/Unlimited dashboards/i)).toBeInTheDocument()
  })

  it("handles plan selection", async () => {
    const onSelect = vi.fn().mockResolvedValue(undefined)
    render(
      <UpgradeModal
        open
        onOpenChange={vi.fn()}
        plans={[{ ...plans[0], onSelect }]}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: /upgrade to growth/i }))
    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1))
  })
})
