# BlurWrapper

A flexible wrapper that blurs and optionally dims its children when locked, and renders an upgrade/confirm affordance as either a dialog or an inline, positioned panel.

**Key Features:**
- Focus blocking with `inert` + `aria-hidden`
- Async confirm with `useTransition` (pending state) and error handling
- Screen reader announcements for pending work; error region auto-focus

**Installation:**
```bash
npx shadcn@latest add https://feature-lock.griffen.codes/r/blur-wrapper
```

**Import:**
```typescript
import BlurWrapper from "@/components/blurWrapper/blur-wrapper"
```

See [root README](../../README.md) for project overview and registry information.

---

## Usage Examples

### Basic Dialog Mode

\`\`\`tsx
const [locked, setLocked] = useState(true)

<BlurWrapper
  isBlurred={locked}
  onConfirm={async () => {
    await upgradeUser()
  }}
  onUnblur={() => setLocked(false)}
>
  <PremiumFeature />
</BlurWrapper>
\`\`\`

### Basic Inline Mode

\`\`\`tsx
const [locked, setLocked] = useState(true)

<BlurWrapper
  isBlurred={locked}
  overlayMode="inline"
  inlinePosition="centerCenter"
  onConfirm={async () => {
    await upgradeUser()
  }}
  onUnblur={() => setLocked(false)}
>
  <PremiumFeature />
</BlurWrapper>
\`\`\`

### Custom Overlay with Error Handling

Use the render-prop `overlay` to get full control over the UI with `{ isPending, error, confirm, resetError, registerErrorRef }`.

\`\`\`tsx
<BlurWrapper
  isBlurred={locked}
  overlayMode="inline"
  inlinePosition="rightTop"
  onConfirm={async () => {
    const response = await fetch("/api/upgrade", { method: "POST" })
    if (!response.ok) throw new Error("Payment failed")
  }}
  onUnblur={() => setLocked(false)}
  overlay={({ isPending, error, confirm, resetError, registerErrorRef }) => (
    <div>
      <h3>Upgrade Required</h3>
      {error && (
        <div ref={registerErrorRef} role="alert" tabIndex={-1}>
          {error instanceof Error ? error.message : "Something went wrong"}
        </div>
      )}
      <button onClick={confirm} disabled={isPending}>
        {isPending ? "Processing..." : "Upgrade Now"}
      </button>
    </div>
  )}
>
  <LockedContent />
</BlurWrapper>
\`\`\`

### Multiple Independent Sections

\`\`\`tsx
export function Dashboard() {
  const [analyticsLocked, setAnalyticsLocked] = useState(true)
  const [reportsLocked, setReportsLocked] = useState(true)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <BlurWrapper
        isBlurred={analyticsLocked}
        onConfirm={() => upgradeFeature("analytics")}
        onUnblur={() => setAnalyticsLocked(false)}
      >
        <AnalyticsCard />
      </BlurWrapper>

      <BlurWrapper
        isBlurred={reportsLocked}
        onConfirm={() => upgradeFeature("reports")}
        onUnblur={() => setReportsLocked(false)}
      >
        <ReportsCard />
      </BlurWrapper>
    </div>
  )
}
\`\`\`

---

## API Reference

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isBlurred` | `boolean` | `false` | Controls blur effect and overlay visibility |
| `overlayMode` | `"dialog" \| "inline"` | `"dialog"` | Display mode for upgrade prompt |
| `onConfirm` | `() => Promise<void> \| void` | - | Async upgrade handler |
| `onUnblur` | `() => void` | - | Called after successful upgrade |

### Visual Customization

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `blurIntensity` | `"sm" \| "md" \| "lg" \| "xl" \| "2xl" \| "3xl"` | `"md"` | Tailwind blur class |
| `blurPx` | `number` | - | Exact blur in pixels (overrides intensity) |
| `dimOpacity` | `number` | `1` | Opacity of blurred content (0-1) |
| `disablePointerEvents` | `boolean` | `true` | Prevent interactions with blurred content |
| `className` | `string` | - | Container className |
| `contentClassName` | `string` | - | Content wrapper className |

### Accessibility

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `focusInert` | `boolean` | `true` | Block keyboard focus on blurred content |
| `announcePending` | `boolean` | `true` | Screen reader announces loading states |
| `focusErrorOnSet` | `boolean` | `true` | Auto-focus errors for accessibility |
| `returnFocusTo` | `HTMLElement \| string` | - | Element to restore focus after close |

### Labels & Content

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `confirmLabel` | `string` | `"Confirm"` | Confirm button text |
| `pendingLabel` | `string` | `"Working..."` | Loading state text |
| `dialogTitle` | `string` | `"Feature unavailable"` | Dialog title |
| `dialogDescription` | `string` | - | Dialog description |
| `errorMessage` | `string` | - | Default error message |

### Inline Mode

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inlinePosition` | `InlinePosition` | `"centerCenter"` | Position of inline overlay panel |
| `inlineContainerClassName` | `string` | - | Custom classes for container |
| `inlinePanelClassName` | `string` | - | Custom classes for panel |
| `inlineAriaLabel` | `string` | `"Upgrade panel"` | ARIA label |

### Advanced

| Prop | Type | Description |
|------|------|-------------|
| `overlay` | `ReactNode \| (args) => ReactNode` | Custom overlay content with render props |
| `open` | `boolean` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | Open state change callback |
| `autoUnblurOnConfirm` | `boolean` | Auto-call onUnblur after success |
| `autoCloseDialogOnConfirm` | `boolean` | Close dialog after success |
| `showOverlayOnBlur` | `boolean` | Auto-open overlay when blurred |
| `renderError` | `(error) => ReactNode` | Custom error rendering |

---

## Accessibility Features

BlurWrapper is built with accessibility as a core feature:

- **Focus Blocking**: When blurred, the wrapped content receives `inert` and `aria-hidden` to prevent keyboard focus and screen reader navigation
- **Pending Announcements**: A hidden live region with `role="status"` and `aria-live="polite"` announces the pending label during async operations
- **Error Focus**: On failure, the error container is automatically focused (`tabIndex={-1}`) so screen readers and keyboard users land directly on the error message
- **Error Handling**: Errors from event handlers and async code are handled with component state (not error boundaries), following React best practices
- **Keyboard Support**: Enter to confirm, Escape to close (inline mode)

**Note**: This must remain a Client Component since it uses client-side dialog primitives and React hooks.

---

## Implementation Patterns

### Independent Unlocking
Provide `onUnblur={() => setLocked(false)}` so each locked section can be unlocked independently without affecting others.

### Controlled State
Pass `open`/`onOpenChange` for integrating with higher-level state management (e.g., wizards, multi-step flows).

### Custom Overlays
Use the render-prop form of `overlay` to fully control messaging, visuals, and CTAs while still leveraging the built-in pending/error state management.

### Internationalization
Centralize all label strings (`confirmLabel`, `pendingLabel`, `dialogTitle`, etc.) in your i18n system for easy translation.

### Consistent Styling
- Keep `overlayMode` default to `"dialog"` for consistency; opt into inline overlays where they improve context
- Use `blurPx` for pixel-perfect blur amounts independent of Tailwind's scale
- Use `className` and `contentClassName` for styling hooks
