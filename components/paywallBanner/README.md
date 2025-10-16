# PaywallBanner

An upgrade-friendly announcement banner that highlights new functionality, drives call-to-action clicks, and lets users dismiss the message with optional persistence.

**Key Features:**
- Async primary & secondary actions with loading states and error feedback
- Optional dismissal persistence via `localStorage` (`storageKey`)
- Variant styling for upgrade, info, success, and warning announcements
- Works with links or custom handlers for CTA buttons

**Installation:**
```bash
npx shadcn@latest add https://feature-lock.griffen.codes/r/paywall-banner
```

**Import:**
```typescript
import { PaywallBanner } from "@/components/paywallBanner/paywall-banner"
```

See the [root README](../../README.md) for the full registry overview.

---

## Usage Examples

### Basic Upgrade Prompt

```tsx
<PaywallBanner
  title="Advanced dashboards are now available"
  description="Upgrade to the Growth plan to unlock team-wide analytics, scheduled exports, and more."
  onCtaClick={async () => {
    await startUpgradeFlow()
  }}
  onCtaSuccess={() => toast.success("Upgrade complete")}
  storageKey="dashboard-upgrade-banner"
/>
```

### Link-Based CTA

```tsx
<PaywallBanner
  title="Unlock AI-powered insights"
  description="Preview the new analysis workspace and start a 14-day trial."
  ctaLabel="View pricing"
  ctaHref="/pricing"
  secondaryLabel="Read release notes"
  secondaryHref="/changelog#ai-insights"
/>
```

### With Secondary Action

```tsx
<PaywallBanner
  title="Professional plan launched"
  description="Compare features, invite your finance stakeholder, or snooze this reminder."
  badge="Feature launch"
  onCtaClick={async () => {
    await openCheckout()
  }}
  secondaryLabel="Share with team"
  onSecondaryClick={() => navigator.share?.({ url: window.location.href })}
/>
```

### Warning Variant

```tsx
<PaywallBanner
  variant="warning"
  badge="Quota almost reached"
  title="Only 2 export credits remain"
  description="Upgrade by Friday to avoid interruptions. You can still download reports until the quota resets."
  onCtaClick={() => router.push("/billing")}
/>
```

---

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Primary headline of the banner |
| `description` | `string` | — | Supporting copy shown under the title |
| `badge` | `string \| null` | `"New"` | Optional badge text; set to `null` to hide |
| `variant` | `"upgrade" \| "info" \| "success" \| "warning"` | `"upgrade"` | Accent styling for different announcement types |
| `ctaLabel` | `string` | `"Upgrade now"` | Primary call-to-action label |
| `ctaHref` | `string` | — | Use a link instead of a handler for the primary CTA |
| `onCtaClick` | `() => Promise<void> \| void` | — | Async handler for the primary CTA button |
| `ctaPendingLabel` | `string` | `"Working..."` | Text shown while `onCtaClick` resolves |
| `secondaryLabel` | `string` | — | Secondary action label (outline button) |
| `secondaryHref` | `string` | — | Link target for the secondary action |
| `onSecondaryClick` | `() => Promise<void> \| void` | — | Async handler for the secondary action |
| `dismissible` | `boolean` | `true` | Shows the dismiss icon button |
| `storageKey` | `string` | — | Persist dismissal in `localStorage` using this key |
| `defaultOpen` | `boolean` | `true` | Initial visibility when uncontrolled |
| `open` | `boolean` | — | Controlled visibility state |
| `onOpenChange` | `(open: boolean) => void` | — | Called when visibility changes |
| `showDivider` | `boolean` | `false` | Adds a divider between content and actions on desktop |
| `children` | `React.ReactNode` | — | Additional content such as bullet lists |

### Events

| Prop | Type | Description |
|------|------|-------------|
| `onCtaSuccess` | `() => void` | Fired after `onCtaClick` resolves without error |
| `onCtaError` | `(error: unknown) => void` | Fired when `onCtaClick` throws |
| `onSecondarySuccess` | `() => void` | Fired after `onSecondaryClick` resolves |
| `onSecondaryError` | `(error: unknown) => void` | Fired when `onSecondaryClick` throws |
| `onDismiss` | `() => void` | Fired when the banner is dismissed |

### Styling

Use `className`, `contentClassName`, and `actionsClassName` to tailor layout to your surface (e.g., stacked on mobile, inline on desktop). Each variant exposes accent colors that align with the default Tailwind palette plus the project `primary` color.
