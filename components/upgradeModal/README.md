# UpgradeModal

Standalone upgrade dialog that compares plans, showcases value, and routes users to purchase flows without leaving their current context.

**Key Features:**
- Configurable plan cards with pricing, highlights, and feature lists
- Async CTA handling per plan with loading and error states
- Optional recommended badge, fine print, and support contact block
- Controlled/uncontrolled open state with dialog trigger helpers

**Installation:**
```bash
npx shadcn@latest add https://feature-lock.griffen.codes/r/upgrade-modal
```

**Import:**
```typescript
import { UpgradeModal } from "@/components/upgradeModal/upgrade-modal"
```

---

## Usage Examples

### Basic Trigger & Modal

```tsx
<UpgradeModal
  trigger={
    <Button variant="outline">
      Compare plans
    </Button>
  }
  plans={[
    {
      id: "growth",
      name: "Growth",
      description: "Unlock team collaboration and daily usage insights.",
      price: "$49",
      period: "month",
      highlight: "Best for scaling teams",
      features: ["Unlimited dashboards", "Team benchmarks", "Priority email support"],
      ctaLabel: "Upgrade to Growth",
      onSelect: () => startCheckout("growth"),
    },
    {
      id: "scale",
      name: "Scale",
      recommended: true,
      badge: "Most Popular",
      description: "AI predictions, governance tooling, and premium support.",
      price: "$129",
      period: "month",
      highlight: "Everything in Growth, plus",
      features: [
        "AI churn forecasts",
        { label: "Custom roles & permissions", footnote: "Fine-grained controls by team" },
        "Dedicated onboarding",
      ],
      ctaLabel: "Contact sales",
      ctaHref: "/contact",
    },
  ]}
/>
```

### Controlled State with Callbacks

```tsx
const [open, setOpen] = useState(false)

<UpgradeModal
  open={open}
  onOpenChange={setOpen}
  trigger={
    <Button onClick={() => setOpen(true)}>Upgrade</Button>
  }
  onClose={() => track("upgrade_modal_closed")}
  onPlanSelected={(planId) => track("plan_selected", { planId })}
  finePrint="Prices listed in USD. Taxes may apply."
  supportEmail="sales@feature-lock.dev"
  plans={[
    {
      id: "team",
      name: "Team",
      price: "$79",
      period: "month",
      highlight: "Most popular for product squads",
      features: ["Unlimited collaborators", "Usage dashboards", "Audit logs"],
      ctaLabel: "Start Team plan",
      ctaPendingLabel: "Creating workspace...",
      onSelect: async () => {
        const response = await fetch("/api/upgrade/team", { method: "POST" })
        if (!response.ok) throw new Error("Unable to create Team workspace")
      },
    },
  ]}
/>
```

---

## API Reference

### `UpgradeModal`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `plans` | `UpgradePlan[]` | — | Plan definitions rendered inside the modal |
| `trigger` | `React.ReactNode` | — | Optional trigger rendered via `DialogTrigger asChild` |
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | — | Initial open state when uncontrolled |
| `onOpenChange` | `(open: boolean) => void` | — | Fired whenever dialog open state changes |
| `onClose` | `() => void` | — | Called after the modal closes |
| `onPlanSelected` | `(planId: string) => void` | — | Called after a plan CTA resolves successfully |
| `title` | `string` | `"Unlock more with Feature Lock"` | Modal heading |
| `subtitle` | `string` | — | Optional subheading highlighted in primary color |
| `description` | `string` | Informational text below the heading |
| `badge` | `string \| null` | `"Upgrade"` | Small badge displayed above the title |
| `highlightLabel` | `string` | `"Everything in Free, plus"` | Section label shown above feature lists |
| `finePrint` | `string` | — | Small text rendered under the plan grid |
| `supportEmail` | `string` | — | Email surfaced in a support callout |
| `supportLabel` | `string` | `"Need help? Reach out:"` | Label shown before the support email |
| `footer` | `React.ReactNode` | — | Custom footer area (e.g., secondary actions) |
| `autoCloseOnSelect` | `boolean` | `true` | Close the modal when a plan action succeeds |
| `resetErrorsOnOpen` | `boolean` | `true` | Clear pending/error state each time the modal opens |
| `className` | `string` | — | Extra classes for the dialog content wrapper |
| `contentClassName` | `string` | — | Extra classes for the inner content container |
| `planCardClassName` | `string` | — | Extra classes applied to every plan card |
| `showCloseButton` | `boolean` | `true` | Toggle the default close button in the top corner |

### `UpgradePlan`

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | Unique identifier for tracking selections |
| `name` | `string` | Plan name |
| `description` | `string` | Short summary of what the plan includes |
| `price` | `string` | Display price (e.g., `"$49"` or `"Custom"`) |
| `period` | `string` | Billing cadence suffix (e.g., `"month"`) |
| `badge` | `string` | Small label shown on the plan card |
| `recommended` | `boolean` | Highlights the card with accent styling |
| `highlight` | `string` | Additional emphasis text |
| `features` | `PlanFeature[]` | List of capabilities; supports strings or `{ label, included, footnote }` objects |
| `footnote` | `string` | Extra text rendered below the features list |
| `ctaLabel` | `string` | Primary button label |
| `ctaHref` | `string` | Link target when the CTA routes to another page |
| `ctaPendingLabel` | `string` | Text displayed while `onSelect` is resolving |
| `onSelect` | `() => Promise<void> \| void` | Async handler executed on click |
| `onSelectSuccess` | `() => void` | Callback after a successful `onSelect` |
| `onSelectError` | `(error: unknown) => void` | Callback when `onSelect` throws |

### Helpers

| Export | Description |
|--------|-------------|
| `UpgradeModalTrigger` | Optional re-export of `DialogTrigger` for manual composition |
| `UpgradeModalClose` | Re-export of `DialogClose` to place custom close buttons |

Pair the modal with analytics tracking to understand plan interest, or extend `planCardClassName` for brand-specific theming. The layout adapts to one, two, or three plans automatically.
