# BlurWrapper

A flexible wrapper that blurs and optionally dims its children when locked, and renders an upgrade/confirm affordance as either a dialog or an inline, positioned panel.

- Focus blocking with `inert` + `aria-hidden`
- Async confirm with `useTransition` (pending state) and error handling
- Screen reader announcements for pending work; error region auto-focus

Import:
import BlurWrapper from "@/components/blurWrapper/blur-wrapper"

See app/page.tsx for examples of dialog and inline overlays, pending announcements, and error focusing.

Or view the live demo at https://feature-lock.griffen.codes

---

## Quick start

### Dialog overlay (default)

\`\`\`tsx
export function ExampleDialogMode() {
  async function upgrade() {
    await new Promise((r) => setTimeout(r, 2000))
  }

  const [locked, setLocked] = useState(true)

  return (
    <BlurWrapper
      isBlurred={locked}
      blurIntensity="md"
      dimOpacity={0.6}
      focusInert
      confirmLabel="Upgrade now"
      pendingLabel="Upgrading..."
      onConfirm={upgrade}
      onUnblur={() => setLocked(false)}
    >
      {/* Your locked content */}
      <DashboardSection />
    </BlurWrapper>
  )
}
\`\`\`

### Inline overlay centered over the content

\`\`\`tsx
export function ExampleInlineCentered() {
  const [locked, setLocked] = useState(true)

  async function upgrade() {
    await new Promise((r) => setTimeout(r, 2000))
  }

  return (
    <BlurWrapper
      isBlurred={locked}
      blurPx={4}
      dimOpacity={0.5}
      focusInert
      overlayMode="inline"
      inlinePosition="centerCenter"
      onConfirm={upgrade}
      onUnblur={() => setLocked(false)}
    >
      <BillingSettings />
    </BlurWrapper>
  )
}
\`\`\`

### Custom overlay with error handling and a11y focus

Use the render-prop overlay to get \`{ isPending, error, confirm, resetError, registerErrorRef }\`. Register your error container to auto-focus it on failures.

\`\`\`tsx
export function ExampleCustomOverlay() {
  const [locked, setLocked] = useState(true)

  async function sometimesFails() {
    await new Promise((r) => setTimeout(r, 1200))
    if (Math.random() < 0.5) throw new Error("Payment authorization failed.")
  }

  return (
    <BlurWrapper
      isBlurred={locked}
      overlayMode="inline"
      inlinePosition="rightTop"
      onConfirm={sometimesFails}
      onUnblur={() => setLocked(false)}
    >
      <Reports />
    </BlurWrapper>
  )
}

// inside BlurWrapper, pass overlay prop:
<BlurWrapper
  isBlurred
  overlayMode="inline"
  inlinePosition="rightTop"
  onConfirm={sometimesFails}
  onUnblur={() => setLocked(false)}
  overlay={({ isPending, error, confirm, close, resetError, registerErrorRef, focusError }) => (
    <div>
      <h3 className="text-sm font-medium">Upgrade required</h3>
      {error && (
        <div
          ref={registerErrorRef as any}
          role="alert"
          tabIndex={-1}
          className="mt-2 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          {error instanceof Error ? error.message : "Something went wrong. Please try again."}
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <button
          onClick={() => {
            if (error) resetError()
            confirm()
          }}
          disabled={isPending}
        >
          {isPending ? "Upgrading..." : "Upgrade now"}
        </button>
      </div>
    </div>
  )}
>
  {/* locked content */}
</BlurWrapper>
\`\`\`

---

## Props

- \`isBlurred?: boolean\` — Blur/dim and disable interactions when true.
- \`disablePointerEvents?: boolean = true\` — Prevent pointer interactions behind the overlay.
- \`focusInert?: boolean = true\` — Apply \`inert\` and \`aria-hidden\` to block keyboard focus while blurred.
- \`blurPx?: number\` — Exact pixel blur; if set, overrides \`blurIntensity\`.
- \`blurIntensity?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" = "md"\` — Tailwind blur level when \`blurPx\` is not set.
- \`dimOpacity?: number = 1\` — Opacity for dimming while blurred (0..1).
- \`className?: string\`, \`contentClassName?: string\` — Style hooks.

Overlay behavior:
- \`overlayMode?: "dialog" | "inline" = "dialog"\`
- \`overlay?: ReactNode | (args) => ReactNode\` — Provide custom body. Render-prop receives:
  \`{ isPending, error, confirm, close, resetError, registerErrorRef, focusError }\`.
- \`showOverlayOnBlur?: boolean = true\` — Auto-open when blurred.
- \`open?: boolean\`, \`onOpenChange?: (open: boolean) => void\` — Control the overlay state if needed.

Async confirm and a11y:
- \`onConfirm?: () => Promise<void> | void\` — Async action to run on confirm.
- \`onUnblur?: () => void\`, \`autoUnblurOnConfirm?: boolean = true\` — Unblur after success.
- \`confirmLabel?: string = "Confirm"\`, \`pendingLabel?: string = "Working..."\`
- Pending state is announced via a live region; screen readers hear the pending label while the action runs.
- Failures are caught in the click handler, stored in state, and rendered inline; error focus is moved to the error box for better a11y.

Inline positioning:
- \`inlinePosition?: "leftTop" | "leftCenter" | "leftBottom" | "centerTop" | "centerCenter" | "centerBottom" | "rightTop" | "rightCenter" | "rightBottom" = "centerCenter"\`
- \`inlineContainerClassName?: string\`, \`inlinePanelClassName?: string\`

Default dialog content:
- \`dialogTitle?: string\`, \`dialogDescription?: string\`

Error customization:
- \`errorMessage?: string\` — Message for the default error UI.
- \`renderError?: (error) => ReactNode\` — Fully custom error rendering.

---

## Accessibility

- Focus blocking: When blurred, the wrapped subtree receives \`inert\` and \`aria-hidden\` to stop focus and screen reader navigation from reaching it.
- Pending announcements: A hidden live region with \`role="status"\` and \`aria-live="polite"\` reads the pending label while the async action runs.
- Error focus: On failure, the error container is focused (\`tabIndex={-1}\`) so screen readers and keyboard users land directly on the message.
- Error handling: Errors from event handlers and async code are handled with component state (not error boundaries), which is the recommended approach.
- Keep this component as a Client Component since it composes a client-only dialog; third‑party client UI should live in Client Components in the App Router.

---

## Patterns

- Unlock on success: Provide \`onUnblur={() => setLocked(false)}\` so each section can unlock independently.
- Controlled overlays: Pass \`open\`/\`onOpenChange\` for integrating with higher-level state (e.g., wizards).
- Custom overlay: Use the render-prop form to fully control messaging, visuals, and the CTA while still leveraging pending/error plumbing.

---

## Migration tips

- Centralize shared strings (labels, messages) for i18n.
- Keep \`overlayMode\` default to \`"dialog"\` for consistency across the app; opt-in to inline overlays where they improve context.
- Prefer \`blurPx\` if you want consistent visuals independent of Tailwind scale.

---

## Example snippet (inline + async + error)

\`\`\`tsx
<BlurWrapper
  isBlurred={locked}
  overlayMode="inline"
  inlinePosition="centerCenter"
  onConfirm={async () => {
    await new Promise((r) => setTimeout(r, 1500))
    if (Math.random() < 0.5) throw new Error("Random failure")
  }}
  onUnblur={() => setLocked(false)}
>
  <YourLockedContent />
</BlurWrapper>
\`\`\`

---

## Changelog

- Added inline overlay mode with flexible positioning.
- Added pending announcements and auto-focus to error region.
- Removed "Maybe later" from default overlays; optional dismiss button is still supported.

---

## License

MIT (or your org’s chosen license).

---

## References

- Next.js App Router: Server and Client Components (why this is a Client Component)
- Next.js Error Handling (event handler errors are handled with state/UI)
