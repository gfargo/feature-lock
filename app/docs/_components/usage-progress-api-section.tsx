import { PropDoc } from "@/components/docs/prop-doc";

export function UsageProgressApiSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          UsageProgress API
        </h2>
        <p className="text-muted-foreground">
          Props for the quota tracking component
        </p>
      </div>

      <div className="space-y-8">
        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Core Props</h3>
          <div className="space-y-4">
            <PropDoc
              name="tracks"
              type="UsageTrack[]"
              description="Usage rows displayed with progress bars"
            />
            <PropDoc
              name="variant"
              type='"card" | "inline"'
              defaultValue='"card"'
              description="Switch between card layout and inline section"
            />
            <PropDoc
              name="title"
              type="string"
              defaultValue='"Usage overview"'
              description="Heading shown above the usage metrics"
            />
            <PropDoc
              name="subtitle"
              type="string"
              defaultValue='"Stay on top of quota limits and see when to upgrade."'
              description="Supporting text displayed under the heading"
            />
            <PropDoc
              name="showSummary"
              type="boolean"
              defaultValue="true"
              description="Toggle visibility of the summary/info banner"
            />
            <PropDoc
              name="summaryLabel"
              type="string"
              defaultValue='"Upgrade unlocks"'
              description="Label displayed in the summary banner"
            />
            <PropDoc
              name="summaryValue"
              type="string"
              description="Highlighted value shown on the right side of the summary banner"
            />
            <PropDoc
              name="summaryMessage"
              type="string"
              description="Additional text under the summary label"
            />
            <PropDoc
              name="note"
              type="string"
              description="Small note displayed alongside CTAs"
            />
            <PropDoc
              name="className"
              type="string"
              description="Custom classes applied to the UsageProgress wrapper"
            />
            <PropDoc
              name="trackClassName"
              type="string"
              description="Classes appended to the track list container"
            />
            <PropDoc
              name="summaryClassName"
              type="string"
              description="Classes appended to the summary/info banner"
            />
            <PropDoc
              name="footerClassName"
              type="string"
              description="Classes appended to the optional footer region"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Actions</h3>
          <div className="space-y-4">
            <PropDoc
              name="ctaLabel"
              type="string"
              defaultValue='"Upgrade plan"'
              description="Primary CTA button label"
            />
            <PropDoc
              name="ctaHref"
              type="string"
              description="Link target if no async handler is provided"
            />
            <PropDoc
              name="ctaPendingLabel"
              type="string"
              defaultValue='"Working..."'
              description="Text shown while the CTA handler resolves"
            />
            <PropDoc
              name="onCtaClick"
              type="() => Promise<void> | void"
              description="Async handler for the primary CTA"
            />
            <PropDoc
              name="onCtaSuccess"
              type="() => void"
              description="Callback fired after a successful CTA"
            />
            <PropDoc
              name="onCtaError"
              type="(error: unknown) => void"
              description="Callback fired when the CTA handler throws"
            />
            <PropDoc
              name="secondaryLabel"
              type="string"
              description="Label for the optional secondary button"
            />
            <PropDoc
              name="onSecondaryClick"
              type="() => void"
              description="Handler for the secondary action"
            />
            <PropDoc
              name="pending"
              type="boolean"
              defaultValue="false"
              description="Force the CTA into a loading state externally"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50 space-y-3">
          <h3 className="text-xl font-semibold">UsageTrack fields</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
            <li>
              <code>label</code> (string): Display name for the quota.{" "}
              <code>value</code> (number) and <code>limit</code> (number)
              calculate percentages automatically.
            </li>
            <li>
              <code>percentage</code> (number): Override percentage when no limit
              applies. <code>status</code> controls styling (
              <code>&quot;ok&quot;</code>, <code>&quot;warning&quot;</code>,
              <code>&quot;critical&quot;</code>).
            </li>
            <li>
              Optional fields: <code>badge</code>, <code>trend</code> (
              <code>&quot;up&quot;</code>, <code>&quot;down&quot;</code>,
              <code>&quot;steady&quot;</code>), <code>description</code>. They
              reinforce messaging without clutter.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
