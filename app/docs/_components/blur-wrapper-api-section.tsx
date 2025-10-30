import { DocsCodeBlock } from "@/components/docs/code-block";
import { PropDoc } from "@/components/docs/prop-doc";

export function BlurWrapperApiSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          BlurWrapper API
        </h2>
        <p className="text-muted-foreground">
          Complete prop reference and TypeScript types for BlurWrapper
        </p>
      </div>

      <div className="space-y-8">
        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Core Props</h3>
          <div className="space-y-4">
            <PropDoc
              name="isBlurred"
              type="boolean"
              defaultValue="false"
              description="When true, applies blur effect and shows overlay"
            />
            <PropDoc
              name="overlayMode"
              type='"dialog" | "inline"'
              defaultValue='"dialog"'
              description="Controls whether overlay appears as modal dialog or inline panel"
            />
            <PropDoc
              name="onConfirm"
              type="() => Promise<void> | void"
              description="Async function called when user clicks confirm button"
            />
            <PropDoc
              name="onUnblur"
              type="() => void"
              description="Callback fired after successful confirmation (auto-called if autoUnblurOnConfirm is true)"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Visual Customization</h3>
          <div className="space-y-4">
            <PropDoc
              name="blurIntensity"
              type='"sm" | "md" | "lg" | "xl" | "2xl" | "3xl"'
              defaultValue='"md"'
              description="Tailwind blur class to apply (overridden by blurPx if set)"
            />
            <PropDoc
              name="blurPx"
              type="number"
              description="Exact blur amount in pixels (overrides blurIntensity)"
            />
            <PropDoc
              name="dimOpacity"
              type="number"
              defaultValue="1"
              description="Opacity of blurred content (0 to 1)"
            />
            <PropDoc
              name="disablePointerEvents"
              type="boolean"
              defaultValue="true"
              description="Prevents clicking/interacting with blurred content"
            />
            <PropDoc
              name="icon"
              type="LucideIcon"
              description="Custom Lucide icon to display in overlay (default: Lock)"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Accessibility</h3>
          <div className="space-y-4">
            <PropDoc
              name="focusInert"
              type="boolean"
              defaultValue="true"
              description="Adds inert and aria-hidden to prevent keyboard focus on blurred content"
            />
            <PropDoc
              name="announcePending"
              type="boolean"
              defaultValue="true"
              description="Screen reader announces pending state during async operations"
            />
            <PropDoc
              name="focusErrorOnSet"
              type="boolean"
              defaultValue="true"
              description="Automatically moves focus to error message when error occurs"
            />
            <PropDoc
              name="returnFocusTo"
              type="HTMLElement | string"
              description="Element or selector to restore focus to after overlay closes"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Labels &amp; Content</h3>
          <div className="space-y-4">
            <PropDoc
              name="confirmLabel"
              type="string"
              defaultValue='"Confirm"'
              description="Text for the confirm button"
            />
            <PropDoc
              name="pendingLabel"
              type="string"
              defaultValue='"Working..."'
              description="Text shown during async operation"
            />
            <PropDoc
              name="dialogTitle"
              type="string"
              defaultValue='"Feature unavailable"'
              description="Title for dialog mode overlay"
            />
            <PropDoc
              name="dialogDescription"
              type="string"
              description="Description text for dialog mode"
            />
            <PropDoc
              name="errorMessage"
              type="string"
              description="Default error message to display on failure"
            />
            <PropDoc
              name="secondaryLabel"
              type="string"
              description="Text for the secondary action button"
            />
            <PropDoc
              name="secondaryPendingLabel"
              type="string"
              defaultValue='"Working..."'
              description="Text shown during secondary action async operation"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Secondary Actions</h3>
          <div className="space-y-4">
            <PropDoc
              name="onSecondaryConfirm"
              type="() => Promise<void> | void"
              description="Async function called when user clicks secondary action button"
            />
            <PropDoc
              name="onSecondaryConfirmError"
              type="(error: unknown) => void"
              description="Callback fired when secondary action fails"
            />
            <PropDoc
              name="onSecondaryConfirmFinally"
              type='(result: "success" | "error") => void'
              description="Callback fired after secondary action completes (success or error)"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Inline Mode</h3>
          <div className="space-y-4">
            <PropDoc
              name="inlinePosition"
              type='"leftTop" | "leftCenter" | "leftBottom" | "centerTop" | "centerCenter" | "centerBottom" | "rightTop" | "rightCenter" | "rightBottom"'
              defaultValue='"centerCenter"'
              description="Position of inline overlay panel"
            />
            <PropDoc
              name="inlineContainerClassName"
              type="string"
              description="Custom classes for inline overlay container"
            />
            <PropDoc
              name="inlinePanelClassName"
              type="string"
              description="Custom classes for inline overlay panel"
            />
            <PropDoc
              name="inlineAriaLabel"
              type="string"
              defaultValue='"Upgrade panel"'
              description="ARIA label for inline overlay"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Advanced</h3>
          <div className="space-y-4">
            <PropDoc
              name="overlay"
              type="ReactNode | (args) => ReactNode"
              description="Custom overlay content (function receives isPending, error, confirm, etc.)"
            />
            <PropDoc
              name="open"
              type="boolean"
              description="Controlled open state for overlay (use with onOpenChange)"
            />
            <PropDoc
              name="onOpenChange"
              type="(open: boolean) => void"
              description="Callback when overlay open state changes"
            />
            <PropDoc
              name="autoUnblurOnConfirm"
              type="boolean"
              defaultValue="true"
              description="Automatically call onUnblur after successful confirmation"
            />
            <PropDoc
              name="autoCloseDialogOnConfirm"
              type="boolean"
              defaultValue="true"
              description="Close dialog after successful confirmation"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">
              Secondary Action Button
            </h3>
            <p className="text-muted-foreground mb-4">
              Add a secondary button for alternative actions like &ldquo;Learn
              More&rdquo; or &ldquo;Contact Sales&rdquo;:
            </p>
            <DocsCodeBlock
              index={9}
              type="advanced_secondary_action"
              code={`<BlurWrapper
  isBlurred={locked}
  overlayMode="dialog"
  dialogTitle="Upgrade to Pro"
  dialogDescription="Unlock advanced features and premium support"
  confirmLabel="Start Free Trial"
  secondaryLabel="Learn More"
  onConfirm={async () => {
    await startTrial()
    setLocked(false)
  }}
  onSecondaryConfirm={async () => {
    // Open documentation or pricing page
    window.open("/pricing", "_blank")
  }}
  onUnblur={() => setLocked(false)}
>
  <PremiumFeatureContent />
</BlurWrapper>`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">
              Multiple Independent Sections
            </h3>
            <p className="text-muted-foreground mb-4">
              Each section can be unlocked independently with its own state:
            </p>
            <DocsCodeBlock
              index={10}
              type="advanced_multiple_sections"
              code={`export function Dashboard() {
  const [analyticsLocked, setAnalyticsLocked] = useState(true)
  const [reportsLocked, setReportsLocked] = useState(true)
  const [exportsLocked, setExportsLocked] = useState(true)

  async function upgradeFeature(feature: string) {
    await fetch("/api/upgrade", {
      method: "POST",
      body: JSON.stringify({ feature })
    })
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
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

      <BlurWrapper
        isBlurred={exportsLocked}
        onConfirm={() => upgradeFeature("exports")}
        onUnblur={() => setExportsLocked(false)}
      >
        <ExportsCard />
      </BlurWrapper>
    </div>
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">
              Controlled Overlay State
            </h3>
            <p className="text-muted-foreground mb-4">
              Control when the overlay appears for custom flows:
            </p>
            <DocsCodeBlock
              index={11}
              type="advanced_controlled_state"
              code={`export function ControlledExample() {
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
}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
