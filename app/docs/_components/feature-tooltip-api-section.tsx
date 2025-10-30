import { PropDoc } from "@/components/docs/prop-doc";

export function FeatureTooltipApiSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          FeatureTooltip API
        </h2>
        <p className="text-muted-foreground">
          Props for lightweight inline upgrade nudges
        </p>
      </div>

      <div className="space-y-8">
        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Core Props</h3>
          <div className="space-y-4">
            <PropDoc
              name="title"
              type="string"
              description="Headline displayed at the top of the tooltip"
            />
            <PropDoc
              name="description"
              type="string"
              description="Supporting body copy underneath the title"
            />
            <PropDoc
              name="badge"
              type="string | null"
              defaultValue='"Upgrade to unlock"'
              description="Optional badge text shown next to the icon; set to null to hide"
            />
            <PropDoc
              name="icon"
              type="LucideIcon"
              defaultValue="Lock"
              description="Icon rendered within the tooltip header"
            />
            <PropDoc
              name="children"
              type="React.ReactNode"
              description="Trigger element that displays the tooltip on hover or focus"
            />
            <PropDoc
              name="disabled"
              type="boolean"
              defaultValue="false"
              description="Render children without tooltip behavior when true"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Highlights &amp; Styling</h3>
          <div className="space-y-4">
            <PropDoc
              name="highlights"
              type="(string | { icon?: LucideIcon; label: string })[]"
              description="List of feature value props shown as bullet items"
            />
            <PropDoc
              name="highlightIcon"
              type="LucideIcon"
              defaultValue="CheckCircle2"
              description="Icon used when highlights are provided as strings"
            />
            <PropDoc
              name="className"
              type="string"
              description="Custom classes applied to the trigger wrapper"
            />
            <PropDoc
              name="contentClassName"
              type="string"
              description="Custom classes applied to the tooltip content container"
            />
            <PropDoc
              name="badgeClassName"
              type="string"
              description="Custom classes for styling the badge element"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">CTA &amp; Events</h3>
          <div className="space-y-4">
            <PropDoc
              name="ctaLabel"
              type="string"
              defaultValue='"Upgrade"'
              description="Label for the primary call-to-action button"
            />
            <PropDoc
              name="ctaHref"
              type="string"
              description="Link URL for the CTA when no async handler is provided"
            />
            <PropDoc
              name="ctaPendingLabel"
              type="string"
              defaultValue='"Working..."'
              description="Label shown while onCtaClick is resolving"
            />
            <PropDoc
              name="onCtaClick"
              type="() => Promise<void> | void"
              description="Async handler invoked when the CTA button is clicked"
            />
            <PropDoc
              name="onCtaSuccess"
              type="() => void"
              description="Callback fired after the CTA handler resolves successfully"
            />
            <PropDoc
              name="onCtaError"
              type="(error: unknown) => void"
              description="Callback fired when the CTA handler throws or rejects"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Positioning &amp; Control</h3>
          <div className="space-y-4">
            <PropDoc
              name="side"
              type='"top" | "bottom" | "left" | "right"'
              defaultValue='"top"'
              description="Placement of the tooltip relative to the trigger"
            />
            <PropDoc
              name="align"
              type='"start" | "center" | "end"'
              defaultValue='"center"'
              description="Alignment of the tooltip on the chosen side"
            />
            <PropDoc
              name="sideOffset"
              type="number"
              defaultValue="12"
              description="Pixels of offset between tooltip and trigger"
            />
            <PropDoc
              name="delayDuration"
              type="number"
              defaultValue="200"
              description="Delay in milliseconds before the tooltip appears"
            />
            <PropDoc
              name="open"
              type="boolean"
              description="Controlled open state for the tooltip"
            />
            <PropDoc
              name="defaultOpen"
              type="boolean"
              description="Initial open state when uncontrolled"
            />
            <PropDoc
              name="onOpenChange"
              type="(open: boolean) => void"
              description="Callback fired whenever the tooltip open state changes"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
