# UsageProgress

Visual usage bars that highlight quota consumption, warn before limits, and funnel users toward the right upgrade path.

**Key Features:**
- Track multiple quotas with status badges, trend indicators, and contextual notes
- Inline upgrade CTA with async handler support and secondary actions
- Summary block for plan unlock messaging and support callouts
- Works as a standalone card or inline section depending on layout needs

**Installation:**
```bash
npx shadcn@latest add https://feature-lock.griffen.codes/r/usage-progress
```

**Import:**
```typescript
import { UsageProgress } from "@/components/usageProgress/usage-progress"
```

---

## Usage Examples

### Quota Overview Card

```tsx
import { UsageProgress } from "@/components/usageProgress/usage-progress"

<UsageProgress
  title="Seat usage"
  subtitle="Keep an eye on team adoption and invite limits."
  tracks={[
    {
      label: "Seats",
      value: 48,
      limit: 50,
      status: "warning",
      badge: "92% used",
      description: "Upgrade to Growth for 100 seats",
    },
    {
      label: "Guests",
      value: 12,
      limit: 25,
      status: "ok",
      badge: "48% used",
    },
  ]}
  summaryValue="Growth plan unlocks +50 seats"
  summaryMessage="Invite the rest of your org without hitting hard stops."
  ctaLabel="Upgrade to Growth"
  onCtaClick={async () => {
    const response = await fetch("/api/upgrade", { method: "POST" })
    if (!response.ok) throw new Error("Unable to upgrade")
  }}
/>
```

### Inline Usage Banner

```tsx
<UsageProgress
  variant="inline"
  title="Monthly exports"
  subtitle="Exports reset in 10 days."
  tracks={[
    {
      label: "CSV exports",
      value: 45,
      limit: 50,
      status: "critical",
      badge: "5 exports remaining",
    },
  ]}
  showSummary={false}
  ctaLabel="See plans"
  ctaHref="/pricing#exports"
  secondaryLabel="Contact sales"
  onSecondaryClick={() => window.open("mailto:sales@feature-lock.dev")}
  note="Need more? Scale plan unlocks unlimited exports."
/>
```

---

## API Reference

### `UsageProgress`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Usage overview"` | Heading displayed above the usage list |
| `subtitle` | `string` | `"Stay on top of quota limits and see when to upgrade."` | Supporting text under the heading |
| `tracks` | `UsageTrack[]` | — | Usage rows rendered with progress bars |
| `variant` | `"card" \| "inline"` | `"card"` | Switch between card and inline presentation |
| `showSummary` | `boolean` | `true` | Toggles the summary block |
| `summaryLabel` | `string` | `"Upgrade unlocks"` | Heading for the summary block |
| `summaryValue` | `string` | — | Highlighted value (e.g., “Growth adds +50 seats”) |
| `summaryMessage` | `string` | — | Short copy supporting the summary |
| `ctaLabel` | `string` | `"Upgrade plan"` | Primary CTA text |
| `ctaHref` | `string` | — | Link target when no async handler is provided |
| `ctaPendingLabel` | `string` | `"Working..."` | Text shown while the CTA handler resolves |
| `onCtaClick` | `() => Promise<void> \| void` | — | Async handler for the primary CTA |
| `onCtaSuccess` | `() => void` | — | Callback after a successful CTA |
| `onCtaError` | `(error: unknown) => void` | — | Callback when a CTA handler throws |
| `secondaryLabel` | `string` | — | Text for an optional secondary button |
| `onSecondaryClick` | `() => void` | — | Handler for the secondary action |
| `note` | `string` | — | Small note shown next to the CTA row |
| `footer` | `React.ReactNode` | — | Custom footer content |
| `className` | `string` | — | Wrapper classes |
| `trackClassName` | `string` | — | Classes applied to the track list |
| `summaryClassName` | `string` | — | Classes applied to the summary block |
| `footerClassName` | `string` | — | Classes applied to the footer |
| `pending` | `boolean` | `false` | Forces the CTA into a loading state |

### `UsageTrack`

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Display label for the quota |
| `value` | `number` | Current consumption |
| `limit` | `number` | Optional quota limit; used to compute percentage |
| `percentage` | `number` | Override percentage (0-100) when limit isn’t relevant |
| `status` | `"ok" \| "warning" \| "critical"` | Drives badge/progress bar styling |
| `badge` | `string` | Highlight text (e.g., “92% used”) |
| `trend` | `"up" \| "down" \| "steady"` | Adds a directional indicator to the value |
| `description` | `string` | Additional context shown beneath the label |
| `footnote` | `string` | Optional smaller text under the feature bullet |

`UsageProgress` is perfect for quota dashboards, billing alerts, and in-product upgrade prompts—pair it with live metrics to keep users informed and ready to upgrade before hitting limits.
