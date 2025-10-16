# FeatureTooltip

Inline tooltip that teases locked functionality and nudges users toward upgrading without interrupting their flow.

**Key Features:**
- Hover/focus trigger with Radix tooltip accessibility baked in
- Optional upgrade CTA (async handler or external link) with loading + error states
- Highlight list to preview the value users unlock
- Customizable badge, icon, alignment, and placement

**Installation:**
```bash
npx shadcn@latest add https://feature-lock.griffen.codes/r/feature-tooltip
```

**Import:**
```typescript
import { FeatureTooltip } from "@/components/featureTooltip/feature-tooltip"
```

See the [root README](../../README.md) for registry details.

---

## Usage Examples

### Basic Usage

```tsx
<FeatureTooltip
  title="Pro analytics"
  description="Breakdowns, saved filters, and cohort exports."
  highlights={[
    "Unlimited dashboards",
    "CSV + PDF exports",
    "Segment comparisons",
  ]}
  ctaLabel="View pricing"
  ctaHref="/pricing"
>
  <button className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground">
    <Lock className="size-4" aria-hidden="true" />
    Team insights (Pro)
  </button>
</FeatureTooltip>
```

### Async CTA

```tsx
<FeatureTooltip
  title="Start your Pro trial"
  description="We&apos;ll ask for billing details later."
  highlights={["14-day trial", "Cancel anytime"]}
  ctaLabel="Start trial"
  ctaPendingLabel="Starting..."
  onCtaClick={async () => {
    const response = await fetch("/api/trial", { method: "POST" })
    if (!response.ok) throw new Error("Trial could not be started")
  }}
>
  <span className="inline-flex items-center gap-1 text-sm text-primary">
    <Sparkles className="size-4" aria-hidden="true" />
    Launch automation (trial)
  </span>
</FeatureTooltip>
```

### Controlled Visibility

```tsx
const [open, setOpen] = useState(false)

<FeatureTooltip
  open={open}
  onOpenChange={setOpen}
  title="Quota reached"
  description="Upgrade to keep exporting unlimited reports."
  highlights={["Up to 5k exports / month", "Priority support"]}
  ctaLabel="Upgrade"
  ctaHref="/billing"
>
  <Button onClick={() => setOpen(!open)} variant="ghost" size="sm">
    Upgrade options
  </Button>
</FeatureTooltip>
```

---

## API Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Primary heading inside the tooltip |
| `description` | `string` | — | Supporting copy displayed under the title |
| `badge` | `string \| null` | `"Upgrade to unlock"` | Optional badge text; set to `null` to hide it |
| `icon` | `LucideIcon` | `Lock` | Icon shown in the tooltip header |
| `highlights` | `(string \| { icon?: LucideIcon; label: string })[]` | — | Value props rendered as a list |
| `ctaLabel` | `string` | `"Upgrade"` | Text for the primary CTA |
| `ctaHref` | `string` | — | Link target for CTA when no async handler is provided |
| `ctaPendingLabel` | `string` | `"Working..."` | Text while `onCtaClick` resolves |
| `onCtaClick` | `() => Promise<void> \| void` | — | Async handler for CTA button |
| `onCtaSuccess` | `() => void` | — | Fired after `onCtaClick` resolves |
| `onCtaError` | `(error: unknown) => void` | — | Fired when `onCtaClick` rejects |
| `side` | `"top" \| "bottom" \| "left" \| "right"` | `"top"` | Tooltip placement relative to trigger |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alignment of tooltip on chosen side |
| `delayDuration` | `number` | `200` | Delay before the tooltip opens (ms) |
| `open` | `boolean` | — | Controlled visibility state |
| `defaultOpen` | `boolean` | — | Initial visibility for uncontrolled usage |
| `onOpenChange` | `(open: boolean) => void` | — | Called when tooltip open state changes |
| `disabled` | `boolean` | `false` | Render children without tooltip behavior |
| `className` | `string` | — | Classes applied to the trigger wrapper |
| `contentClassName` | `string` | — | Classes applied to the tooltip content |

`FeatureTooltip` wraps Radix tooltip primitives, so focus and hover interactions follow accessibility best practices out of the box. Add the component wherever you need lightweight upsells—tables, buttons, inline text, or icons.
