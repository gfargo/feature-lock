import * as React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { AgeGateSection } from "./age-gate-section"

// Mock Vercel Analytics
vi.mock("@vercel/analytics", () => ({
  track: vi.fn(),
}))

// Mock Next.js Link
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock the UI components
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, disabled, ...props }: React.ComponentProps<"button">) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}))

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children, ...props }: React.ComponentProps<"span">) => (
    <span {...props}>{children}</span>
  ),
}))

// Mock AgeGate component
vi.mock("@/components/ageGate/age-gate", () => ({
  default: ({ open, onVerified, onDenied, children, method, labels }: any) => (
    <div data-testid="age-gate" data-open={open} data-method={method}>
      <div>{labels?.title}</div>
      <div>{labels?.description}</div>
      {children}
      <button onClick={() => onVerified?.(25)}>Verify (25 years old)</button>
      <button onClick={() => onDenied?.()}>Deny</button>
    </div>
  ),
}))

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})
window.IntersectionObserver = mockIntersectionObserver

describe("AgeGateSection", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the section with correct content", () => {
    render(<AgeGateSection />)

    expect(screen.getByText(/AgeGate · Verify age without disrupting flow/)).toBeInTheDocument()
    expect(screen.getByText(/Contextual age verification for alcohol/)).toBeInTheDocument()
    expect(screen.getByText("View docs")).toBeInTheDocument()
    expect(screen.getByText("Reset Demo")).toBeInTheDocument()
  })

  it("renders method selection buttons", () => {
    render(<AgeGateSection />)

    expect(screen.getByText("Simple")).toBeInTheDocument()
    expect(screen.getByText("Birthdate")).toBeInTheDocument()
  })

  it("shows age gate component", () => {
    render(<AgeGateSection />)

    expect(screen.getByTestId("age-gate")).toBeInTheDocument()
  })

  it("handles age verification", async () => {
    render(<AgeGateSection />)

    const verifyButton = screen.getByText("Verify (25 years old)")
    fireEvent.click(verifyButton)

    await waitFor(() => {
      expect(screen.getByText("Age verified: 25 years old")).toBeInTheDocument()
      expect(screen.getByText("User can now access age-restricted content")).toBeInTheDocument()
    })
  })

  it("allows method switching", () => {
    render(<AgeGateSection />)

    const birthdateButton = screen.getByText("Birthdate")
    fireEvent.click(birthdateButton)

    const ageGate = screen.getByTestId("age-gate")
    expect(ageGate).toHaveAttribute("data-method", "birthdate")
  })

  it("shows installation command", () => {
    render(<AgeGateSection />)

    expect(screen.getByText("Installation")).toBeInTheDocument()
    expect(screen.getByText(/npx shadcn@latest add/)).toBeInTheDocument()
    expect(screen.getByText("Copy")).toBeInTheDocument()
  })

  it("renders custom children content in age gate", () => {
    render(<AgeGateSection />)

    expect(screen.getByText("Demo Notice")).toBeInTheDocument()
    expect(screen.getAllByText(/This is a demonstration of the AgeGate component/)).toHaveLength(2)
    expect(screen.getByText("Features demonstrated:")).toBeInTheDocument()
  })
})