import * as React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import AgeGate from "./age-gate"

// Mock the UI components
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => 
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => 
    <h2 data-testid="dialog-title">{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => 
    <p data-testid="dialog-description">{children}</p>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => 
    <div data-testid="dialog-footer">{children}</div>,
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, ...props }: React.ComponentProps<"button">) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}))

vi.mock("@/components/ui/input", () => ({
  Input: (props: React.ComponentProps<"input">) => <input {...props} />,
}))

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, ...props }: React.ComponentProps<"label">) => <label {...props}>{children}</label>,
}))

vi.mock("@/lib/utils", () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(" "),
}))

describe("AgeGate", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    sessionStorage.clear()
  })

  it("renders simple age gate dialog", () => {
    render(
      <AgeGate
        open={true}
        method="simple"
        onVerified={vi.fn()}
        onDenied={vi.fn()}
      />
    )

    expect(screen.getByTestId("dialog")).toBeInTheDocument()
    expect(screen.getByText("Age Verification Required")).toBeInTheDocument()
    expect(screen.getByText("I am 18 or older")).toBeInTheDocument()
    expect(screen.getByText("I am under 18")).toBeInTheDocument()
  })

  it("calls onVerified when user confirms age", async () => {
    const onVerified = vi.fn()
    const onDenied = vi.fn()

    render(
      <AgeGate
        open={true}
        method="simple"
        onVerified={onVerified}
        onDenied={onDenied}
      />
    )

    fireEvent.click(screen.getByText("I am 18 or older"))

    await waitFor(() => {
      expect(onVerified).toHaveBeenCalledTimes(1)
      expect(onDenied).not.toHaveBeenCalled()
    })
  })

  it("calls onDenied when user denies age", async () => {
    const onVerified = vi.fn()
    const onDenied = vi.fn()

    render(
      <AgeGate
        open={true}
        method="simple"
        onVerified={onVerified}
        onDenied={onDenied}
      />
    )

    fireEvent.click(screen.getByText("I am under 18"))

    await waitFor(() => {
      expect(onDenied).toHaveBeenCalledTimes(1)
      expect(onVerified).not.toHaveBeenCalled()
    })
  })

  it("renders birthdate method with date input", () => {
    render(
      <AgeGate
        open={true}
        method="birthdate"
        onVerified={vi.fn()}
      />
    )

    expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument()
    expect(screen.getByText("Verify Age")).toBeInTheDocument()
  })

  it("validates birthdate and calculates age correctly", async () => {
    const onVerified = vi.fn()
    
    render(
      <AgeGate
        open={true}
        method="birthdate"
        minimumAge={21}
        onVerified={onVerified}
      />
    )

    // Enter a birthdate that makes user 25 years old
    const birthdate = new Date()
    birthdate.setFullYear(birthdate.getFullYear() - 25)
    const birthdateString = birthdate.toISOString().split('T')[0]

    fireEvent.change(screen.getByLabelText("Date of Birth"), {
      target: { value: birthdateString }
    })

    fireEvent.click(screen.getByText("Verify Age"))

    await waitFor(() => {
      expect(onVerified).toHaveBeenCalledWith(25)
    })
  })

  it("shows error for empty birthdate", async () => {
    render(
      <AgeGate
        open={true}
        method="birthdate"
        onVerified={vi.fn()}
      />
    )

    // Don't enter any date, just click verify
    fireEvent.click(screen.getByText("Verify Age"))

    await waitFor(() => {
      expect(screen.getByText("Please enter your date of birth")).toBeInTheDocument()
    })
  })

  it("remembers verification in localStorage", async () => {
    const onVerified = vi.fn()
    
    const { rerender } = render(
      <AgeGate
        open={true}
        method="simple"
        rememberVerification={true}
        storageKey="test-age-gate"
        storageType="localStorage"
        onVerified={onVerified}
      />
    )

    // Check remember choice checkbox
    fireEvent.click(screen.getByLabelText("Remember my choice"))
    
    // Verify age
    fireEvent.click(screen.getByText("I am 18 or older"))

    await waitFor(() => {
      expect(onVerified).toHaveBeenCalled()
    })

    // Check that verification was stored
    expect(localStorage.getItem("test-age-gate")).toBe("true")

    // Rerender component - should not show dialog due to stored verification
    rerender(
      <AgeGate
        method="simple"
        rememberVerification={true}
        storageKey="test-age-gate"
        storageType="localStorage"
        onVerified={vi.fn()}
      />
    )

    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument()
  })

  it("uses custom labels", () => {
    const customLabels = {
      title: "Custom Age Check",
      description: "Custom description",
      simpleConfirm: "Yes, I'm old enough",
      simpleCancel: "No, I'm too young"
    }

    render(
      <AgeGate
        open={true}
        method="simple"
        labels={customLabels}
        onVerified={vi.fn()}
        onDenied={vi.fn()}
      />
    )

    expect(screen.getByText("Custom Age Check")).toBeInTheDocument()
    expect(screen.getByText("Custom description")).toBeInTheDocument()
    expect(screen.getByText("Yes, I'm old enough")).toBeInTheDocument()
    expect(screen.getByText("No, I'm too young")).toBeInTheDocument()
  })

  it("renders custom verification method", () => {
    const customVerification = vi.fn(() => (
      <div>
        <p>Custom verification UI</p>
        <button>Custom verify button</button>
      </div>
    ))

    render(
      <AgeGate
        open={true}
        method="custom"
        customVerification={customVerification}
      />
    )

    expect(screen.getByText("Custom verification UI")).toBeInTheDocument()
    expect(screen.getByText("Custom verify button")).toBeInTheDocument()
    expect(customVerification).toHaveBeenCalledWith(
      expect.objectContaining({
        isPending: false,
        error: null,
        onVerify: expect.any(Function),
        resetError: expect.any(Function),
        registerErrorRef: expect.any(Function),
        focusError: expect.any(Function),
      })
    )
  })

  it("renders custom children content", () => {
    render(
      <AgeGate
        open={true}
        method="simple"
        onVerified={vi.fn()}
      >
        <div>
          <p>Custom disclaimer text</p>
          <a href="/terms">Terms of Service</a>
          <p>Required by state law</p>
        </div>
      </AgeGate>
    )

    expect(screen.getByText("Custom disclaimer text")).toBeInTheDocument()
    expect(screen.getByText("Terms of Service")).toBeInTheDocument()
    expect(screen.getByText("Required by state law")).toBeInTheDocument()
  })

  it("supports sessionStorage", async () => {
    const onVerified = vi.fn()
    
    render(
      <AgeGate
        open={true}
        method="simple"
        rememberVerification={true}
        storageKey="test-session-age-gate"
        storageType="sessionStorage"
        onVerified={onVerified}
      />
    )

    // Check remember choice checkbox
    fireEvent.click(screen.getByLabelText("Remember my choice"))
    
    // Verify age
    fireEvent.click(screen.getByText("I am 18 or older"))

    await waitFor(() => {
      expect(onVerified).toHaveBeenCalled()
    })

    // Check that verification was stored in sessionStorage
    expect(sessionStorage.getItem("test-session-age-gate")).toBe("true")
  })

  it("supports cookie storage", async () => {
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    })

    const onVerified = vi.fn()
    
    render(
      <AgeGate
        open={true}
        method="simple"
        rememberVerification={true}
        storageKey="test-cookie-age-gate"
        storageType="cookie"
        cookieOptions={{
          maxAge: 86400, // 1 day
          secure: true,
          sameSite: "strict"
        }}
        onVerified={onVerified}
      />
    )

    // Check remember choice checkbox
    fireEvent.click(screen.getByLabelText("Remember my choice"))
    
    // Verify age
    fireEvent.click(screen.getByText("I am 18 or older"))

    await waitFor(() => {
      expect(onVerified).toHaveBeenCalled()
    })

    // Check that cookie was set (basic check)
    expect(document.cookie).toContain("test-cookie-age-gate")
  })
})