import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { FeatureTooltip } from "./feature-tooltip"
import { Sparkles } from "lucide-react"

describe("FeatureTooltip", () => {
  it("renders highlights when open", () => {
    render(
      <FeatureTooltip
        open
        onOpenChange={vi.fn()}
        title="Inline upgrade"
        description="Unlock scheduled exports."
        highlights={["Daily digests", "CSV exports"]}
        icon={Sparkles}
      >
        <span>Preview</span>
      </FeatureTooltip>,
    )

    expect(screen.getAllByText(/Unlock scheduled exports/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Daily digests/i).length).toBeGreaterThan(0)
  })

  it("handles async CTA", async () => {
    const onCtaClick = vi.fn().mockResolvedValue(undefined)

    render(
      <FeatureTooltip
        open
        onOpenChange={vi.fn()}
        title="AI Forecasts"
        highlights={["Trend analysis"]}
        ctaLabel="Upgrade"
        onCtaClick={onCtaClick}
      >
        <span>Trigger</span>
      </FeatureTooltip>,
    )

    const upgradeButtons = screen.getAllByRole("button", { name: /upgrade/i })
    fireEvent.click(upgradeButtons[0])
    await waitFor(() => expect(onCtaClick).toHaveBeenCalledTimes(1))
  })
})
