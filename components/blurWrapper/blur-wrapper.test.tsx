import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import BlurWrapper from "./blur-wrapper"

describe("BlurWrapper", () => {
  it("renders children when not blurred", () => {
    render(
      <BlurWrapper isBlurred={false} onConfirm={vi.fn()}>
        <div>Premium content</div>
      </BlurWrapper>,
    )

    expect(screen.getByText(/Premium content/i)).toBeInTheDocument()
  })

  it("invokes confirm handler in inline mode", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)

    render(
      <BlurWrapper
        isBlurred
        overlayMode="inline"
        overlay={({ confirm }) => (
          <button type="button" onClick={confirm}>
            Unlock now
          </button>
        )}
        onConfirm={onConfirm}
        onUnblur={vi.fn()}
      >
        <div>Locked content</div>
      </BlurWrapper>,
    )

    fireEvent.click(screen.getByRole("button", { name: /unlock now/i }))

    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1))
  })
})
