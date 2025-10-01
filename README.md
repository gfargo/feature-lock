<div align="center">
  <h1>🔒 Feature Lock</h1>
  <p><strong>Contextual feature locking for React that doesn't interrupt flow</strong></p>
  
  <p>
    <a href="https://feature-lock.griffen.codes">Demo</a> •
    <a href="https://feature-lock.griffen.codes/docs">Documentation</a> •
    <a href="https://feature-lock.griffen.codes/blog">Blog Post</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/Next.js-14+-000000?logo=next.js&logoColor=white" alt="Next.js 14+" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="MIT License" />
  </p>
</div>

---

## ✨ What is Feature Lock?

**Feature Lock** is a collection of React components for building contextual upgrade experiences. Instead of redirecting users to pricing pages, show upgrade prompts directly on the features they want to unlock.

### The Problem

Traditional paywalls interrupt the user experience:
- Click "Export Report" → Redirected to pricing page
- Context is lost
- User forgets why they clicked
- Lower conversion rates

### The Solution

Feature Lock keeps users in context:
- Click "Export Report" → Overlay appears on the locked feature
- Clear upgrade prompt right where they need it
- User understands the value immediately
- Higher conversion rates

---

## 📦 Components

### BlurWrapper

The flagship component that **blurs locked features and guides users to upgrade—without breaking their flow**.

<div align="center">
  <img src="https://img.shields.io/badge/status-stable-green" alt="Stable" />
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version 1.0.0" />
</div>

#### Quick Start

\`\`\`bash
npx shadcn@latest add https://feature-lock.griffen.codes/r/blur-wrapper
\`\`\`

#### Basic Usage

\`\`\`tsx
import { useState } from "react"
import BlurWrapper from "@/components/blurWrapper/blur-wrapper"

export function LockedFeature() {
  const [locked, setLocked] = useState(true)

  async function handleUpgrade() {
    await fetch("/api/upgrade", { method: "POST" })
    setLocked(false)
  }

  return (
    <BlurWrapper
      isBlurred={locked}
      onConfirm={handleUpgrade}
      onUnblur={() => setLocked(false)}
    >
      <YourPremiumContent />
    </BlurWrapper>
  )
}
\`\`\`

[**View Full BlurWrapper Documentation →**](#blurwrapper-documentation)

### Coming Soon

- **PaywallBanner** - Dismissible banner for feature announcements
- **UpgradeModal** - Standalone upgrade dialog with plan comparison
- **FeatureTooltip** - Inline tooltips for locked features
- **UsageProgress** - Visual quota indicators with upgrade CTAs

---

## 🚀 Quick Start

### Prerequisites

Make sure you have a Next.js project with shadcn/ui set up:

\`\`\`bash
npx shadcn@latest init
\`\`\`

### Installation

Install the BlurWrapper component:

\`\`\`bash
npx shadcn@latest add https://feature-lock.griffen.codes/r/blur-wrapper
\`\`\`

This installs:
- BlurWrapper component
- Required shadcn/ui components (Button, Dialog)
- All necessary dependencies

### Your First Feature Lock

\`\`\`tsx
import { useState } from "react"
import BlurWrapper from "@/components/blurWrapper/blur-wrapper"

export function Dashboard() {
  const [analyticsLocked, setAnalyticsLocked] = useState(true)

  return (
    <BlurWrapper
      isBlurred={analyticsLocked}
      overlayMode="inline"
      inlinePosition="centerCenter"
      onConfirm={async () => {
        await upgradeUserPlan()
      }}
      onUnblur={() => setAnalyticsLocked(false)}
    >
      <AdvancedAnalytics />
    </BlurWrapper>
  )
}
\`\`\`

---

## 🎯 BlurWrapper Features

### 🎨 Two Overlay Modes

**Dialog Mode** - For critical upgrade decisions
\`\`\`tsx
<BlurWrapper
  isBlurred={locked}
  overlayMode="dialog"
  dialogTitle="Upgrade Required"
  onConfirm={handleUpgrade}
>
  <LockedContent />
</BlurWrapper>
\`\`\`

**Inline Mode** - For subtle, contextual upsells
\`\`\`tsx
<BlurWrapper
  isBlurred={locked}
  overlayMode="inline"
  inlinePosition="centerCenter"
  onConfirm={handleUpgrade}
>
  <LockedContent />
</BlurWrapper>
\`\`\`

### ⚡ Async-Ready

Built with React 19's `useTransition` for seamless async operations:
- Automatic loading states
- Error handling with focus management
- Screen reader announcements
- Unblur on success

\`\`\`tsx
<BlurWrapper
  isBlurred={locked}
  onConfirm={async () => {
    await upgradeUserPlan()
    // Automatically handles loading, errors, and unblur
  }}
  onUnblur={() => setLocked(false)}
>
  <LockedContent />
</BlurWrapper>
\`\`\`

### ♿ Accessible by Default

- **Focus Blocking**: `inert` + `aria-hidden` prevents interaction with blurred content
- **Screen Reader Support**: Pending states announced via live regions
- **Error Focus**: Automatic focus on error messages
- **Keyboard Shortcuts**: Enter to confirm, Escape to close (inline mode)

### 🎛️ Flexible Positioning

Position inline overlays anywhere:
\`\`\`tsx
inlinePosition="leftTop" | "leftCenter" | "leftBottom"
            | "centerTop" | "centerCenter" | "centerBottom"
            | "rightTop" | "rightCenter" | "rightBottom"
\`\`\`

### 🎨 Custom Overlays

Full control with render props:
\`\`\`tsx
<BlurWrapper
  isBlurred={locked}
  overlay={({ isPending, error, confirm, resetError, registerErrorRef }) => (
    <YourCustomOverlay
      loading={isPending}
      error={error}
      onConfirm={confirm}
      onRetry={resetError}
    />
  )}
>
  <LockedContent />
</BlurWrapper>
\`\`\`

---

## 📚 BlurWrapper Documentation

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
| `overlay` | `ReactNode \| (args) => ReactNode` | Custom overlay content |
| `open` | `boolean` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | Open state change callback |
| `autoUnblurOnConfirm` | `boolean` | Auto-call onUnblur after success |
| `autoCloseDialogOnConfirm` | `boolean` | Close dialog after success |

[**View Full API Reference →**](https://feature-lock.griffen.codes/docs)

---

## 🎬 Examples

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

### Custom Error Handling

\`\`\`tsx
<BlurWrapper
  isBlurred={locked}
  overlayMode="inline"
  onConfirm={async () => {
    const response = await fetch("/api/upgrade", { method: "POST" })
    if (!response.ok) throw new Error("Payment failed")
  }}
  overlay={({ isPending, error, confirm, registerErrorRef }) => (
    <div>
      <h3>Unlock Premium Features</h3>
      {error && (
        <div ref={registerErrorRef} role="alert">
          {error.message}
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

### Controlled Overlay State

\`\`\`tsx
export function ControlledExample() {
  const [locked, setLocked] = useState(true)
  const [overlayOpen, setOverlayOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOverlayOpen(true)}>
        Unlock Feature
      </Button>

      <BlurWrapper
        isBlurred={locked}
        open={overlayOpen}
        onOpenChange={setOverlayOpen}
        onConfirm={async () => {
          await upgradeUser()
          setLocked(false)
          setOverlayOpen(false)
        }}
      >
        <LockedContent />
      </BlurWrapper>
    </>
  )
}
\`\`\`

[**View More Examples →**](https://feature-lock.griffen.codes/docs#advanced-examples)

---

## 🏗️ Built With

- **[React 19](https://react.dev)** - UI library with useTransition
- **[Next.js 14+](https://nextjs.org)** - React framework
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[shadcn/ui](https://ui.shadcn.com)** - Component library
- **[Radix UI](https://www.radix-ui.com)** - Accessible primitives

---

## 🎯 When to Use Feature Lock

### ✅ Great For

- Gating premium features (analytics, exports, advanced tools)
- Contextual upgrade prompts in dashboards
- Freemium SaaS products
- Trial limitations
- Feature-based pricing tiers

### ⚠️ Not Recommended For

- Full page paywalls (use traditional pricing pages)
- Content behind authentication (use proper auth)
- Critical security features (don't rely on client-side blur)

---

## 🎨 Component Registry

Feature Lock components are distributed via a ShadcnUI-compatible registry. This means:

✅ **Easy Installation** - One command installs everything
✅ **Automatic Dependencies** - No manual package.json editing
✅ **Version Management** - Registry tracks component versions
✅ **Full Source Code** - Components installed in your project (not node_modules)

### Available Components

| Component | Status | Command |
|-----------|--------|---------|
| BlurWrapper | ✅ Stable | `npx shadcn@latest add https://feature-lock.griffen.codes/r/blur-wrapper` |
| PaywallBanner | 🚧 Coming Soon | - |
| UpgradeModal | 🚧 Coming Soon | - |
| FeatureTooltip | 🚧 Coming Soon | - |
| UsageProgress | 🚧 Coming Soon | - |

### Registry API

The registry exposes these endpoints:
- `GET /api/registry` - List all components
- `GET /api/registry/r/:name` - Get specific component

[**Learn more about the registry →**](./REGISTRY.md)

---

## 📊 Analytics

This project includes Vercel Analytics integration to track:
- Component installations
- Documentation engagement
- Demo interactions
- Conversion funnels

[**View Analytics Guide →**](./ANALYTICS_GUIDE.md)

---

## 🤝 Contributing

We love contributions! Whether you want to:
- 🐛 Report bugs
- ✨ Suggest features
- 📝 Improve documentation
- 💻 Submit code
- 🎨 Design new components

Check out our [**Contributing Guide →**](./CONTRIBUTING.md)

### Development Setup

\`\`\`bash
# Clone the repo
git clone https://github.com/griffenlabs/feature-lock.git
cd feature-lock

# Install dependencies
npm install

# Start dev server
npm run dev

# Generate registry
npm run gen:registry
\`\`\`

---

## 🐛 Troubleshooting

### Import Errors

Verify your `tsconfig.json`:
\`\`\`json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
\`\`\`

### Blur Not Visible

Ensure content has non-transparent background:
\`\`\`tsx
<BlurWrapper isBlurred={locked}>
  <div className="bg-white dark:bg-slate-900">
    {/* Content */}
  </div>
</BlurWrapper>
\`\`\`

### Overlay Not Showing

Check that `showOverlayOnBlur` is not `false`:
\`\`\`tsx
<BlurWrapper
  isBlurred={locked}
  showOverlayOnBlur={true} // Default
>
  <Content />
</BlurWrapper>
\`\`\`

[**View Full Troubleshooting Guide →**](https://feature-lock.griffen.codes/docs#troubleshooting)

---

## 📄 License

MIT © [Griffen Labs](https://github.com/griffenlabs)

See [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgments

- **[shadcn](https://twitter.com/shadcn)** - For the amazing component library and CLI architecture
- **[Radix UI](https://www.radix-ui.com)** - For accessible, unstyled primitives
- **[Vercel](https://vercel.com)** - For hosting and analytics
- **React Team** - For useTransition and concurrent features

---

## 🔗 Links

- **[Live Demo](https://feature-lock.griffen.codes)** - Try it yourself
- **[Documentation](https://feature-lock.griffen.codes/docs)** - Full API reference
- **[Blog Post](https://feature-lock.griffen.codes/blog)** - Design philosophy
- **[GitHub Issues](https://github.com/griffenlabs/feature-lock/issues)** - Report bugs
- **[Discussions](https://github.com/griffenlabs/feature-lock/discussions)** - Ask questions

---

## 📈 Project Roadmap

### Current (v1.0)
- ✅ BlurWrapper component
- ✅ Dialog and inline modes
- ✅ Async handling with useTransition
- ✅ Full accessibility support
- ✅ Component registry
- ✅ Documentation site
- ✅ Analytics integration

### Coming Soon (v1.1)
- 🚧 PaywallBanner component
- 🚧 UpgradeModal component
- 🚧 Additional positioning options
- 🚧 Animation customization

### Future (v2.0)
- 🔮 FeatureTooltip component
- 🔮 UsageProgress component
- 🔮 Internationalization (i18n)
- 🔮 Vue and Svelte versions
- 🔮 Storybook documentation

---

## ⭐ Show Your Support

If Feature Lock helps your project, please give it a star on GitHub! It helps others discover the project.

[![Star on GitHub](https://img.shields.io/github/stars/griffenlabs/feature-lock?style=social)](https://github.com/griffenlabs/feature-lock)

<div align="center">
  <p><strong>Built with ❤️ by Griffen Labs</strong></p>
  <p>
    <a href="https://feature-lock.griffen.codes">Website</a> •
    <a href="https://github.com/griffenlabs/feature-lock">GitHub</a> •
    <a href="https://twitter.com/griffenlabs">Twitter</a>
  </p>
</div>
