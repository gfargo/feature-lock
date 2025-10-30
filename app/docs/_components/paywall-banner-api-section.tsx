import { PropDoc } from "@/components/docs/prop-doc";

export function PaywallBannerApiSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          PaywallBanner API
        </h2>
        <p className="text-muted-foreground">
          Key props for the announcement banner component
        </p>
      </div>

      <div className="space-y-8">
        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Core Props</h3>
          <div className="space-y-4">
            <PropDoc
              name="title"
              type="string"
              description="Primary headline for the announcement banner"
            />
            <PropDoc
              name="description"
              type="string"
              description="Supporting copy displayed under the title"
            />
            <PropDoc
              name="badge"
              type="string | null"
              defaultValue='"New"'
              description="Optional badge label; set to null to hide"
            />
            <PropDoc
              name="variant"
              type='"upgrade" | "info" | "success" | "warning"'
              defaultValue='"upgrade"'
              description="Determines accent styling for the banner"
            />
            <PropDoc
              name="dismissible"
              type="boolean"
              defaultValue="true"
              description="Controls whether the close button is rendered"
            />
            <PropDoc
              name="storageKey"
              type="string"
              description="Persist dismissals in localStorage using this key"
            />
            <PropDoc
              name="defaultOpen"
              type="boolean"
              defaultValue="true"
              description="Initial visibility when the component is uncontrolled"
            />
            <PropDoc
              name="open"
              type="boolean"
              description="Controlled visibility state for the banner"
            />
            <PropDoc
              name="onOpenChange"
              type="(open: boolean) => void"
              description="Callback fired whenever visibility changes"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
            <h3 className="text-xl font-semibold mb-4">Primary Action</h3>
            <div className="space-y-4">
              <PropDoc
                name="ctaLabel"
                type="string"
                defaultValue='"Upgrade now"'
                description="Text for the primary button"
              />
              <PropDoc
                name="ctaHref"
                type="string"
                description="Link target when no onCtaClick handler is provided"
              />
              <PropDoc
                name="onCtaClick"
                type="() => Promise<void> | void"
                description="Async handler for the primary action"
              />
              <PropDoc
                name="ctaPendingLabel"
                type="string"
                defaultValue='"Working..."'
                description="Text shown while onCtaClick resolves"
              />
              <PropDoc
                name="onCtaSuccess"
                type="() => void"
                description="Called after onCtaClick resolves without error"
              />
              <PropDoc
                name="onCtaError"
                type="(error: unknown) => void"
                description="Called when onCtaClick throws or rejects"
              />
            </div>
          </div>

          <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
            <h3 className="text-xl font-semibold mb-4">
              Secondary &amp; Dismiss
            </h3>
            <div className="space-y-4">
              <PropDoc
                name="secondaryLabel"
                type="string"
                description="Text for the optional secondary button"
              />
              <PropDoc
                name="secondaryHref"
                type="string"
                description="Link target when no onSecondaryClick handler is provided"
              />
              <PropDoc
                name="onSecondaryClick"
                type="() => Promise<void> | void"
                description="Async handler for the secondary action"
              />
              <PropDoc
                name="onSecondarySuccess"
                type="() => void"
                description="Called after onSecondaryClick resolves without error"
              />
              <PropDoc
                name="onSecondaryError"
                type="(error: unknown) => void"
                description="Called when the secondary handler throws or rejects"
              />
              <PropDoc
                name="onDismiss"
                type="() => void"
                description="Fired when the banner is dismissed"
              />
            </div>
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Layout &amp; Content</h3>
          <div className="space-y-4">
            <PropDoc
              name="showDivider"
              type="boolean"
              defaultValue="false"
              description="Adds a divider between content and actions on larger screens"
            />
            <PropDoc
              name="className"
              type="string"
              description="Custom classes for the banner container"
            />
            <PropDoc
              name="contentClassName"
              type="string"
              description="Custom classes for the text/content column"
            />
            <PropDoc
              name="actionsClassName"
              type="string"
              description="Custom classes for the action button container"
            />
            <PropDoc
              name="children"
              type="React.ReactNode"
              description="Optional additional content (e.g. bullet lists or disclaimers)"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
