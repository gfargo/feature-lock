import { PropDoc } from "@/components/docs/prop-doc";

export function UpgradeModalApiSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          UpgradeModal API
        </h2>
        <p className="text-muted-foreground">
          Prop reference for the standalone upgrade dialog experience
        </p>
      </div>

      <div className="space-y-8">
        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Core Props</h3>
          <div className="space-y-4">
            <PropDoc
              name="plans"
              type="UpgradePlan[]"
              description="Plan definitions rendered inside the modal"
            />
            <PropDoc
              name="trigger"
              type="React.ReactNode"
              description="Optional trigger rendered as a dialog trigger via asChild"
            />
            <PropDoc
              name="open"
              type="boolean"
              description="Controlled open state; pair with onOpenChange for external toggles"
            />
            <PropDoc
              name="defaultOpen"
              type="boolean"
              description="Initial open state when the modal manages its own visibility"
            />
            <PropDoc
              name="onOpenChange"
              type="(open: boolean) => void"
              description="Fired whenever the dialog open state changes"
            />
            <PropDoc
              name="onClose"
              type="() => void"
              description="Invoked after the modal closes (user action or programmatic)"
            />
            <PropDoc
              name="onPlanSelected"
              type="(planId: string) => void"
              description="Receive the plan id after a CTA resolves successfully"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Content &amp; Styling</h3>
          <div className="space-y-4">
            <PropDoc
              name="title"
              type="string"
              defaultValue='"Unlock more with Feature Lock"'
              description="Modal heading shown at the top of the dialog"
            />
            <PropDoc
              name="subtitle"
              type="string"
              description="Optional subheading styled in the primary color"
            />
            <PropDoc
              name="description"
              type="string"
              description="Supporting paragraph that explains the upgrade value"
            />
            <PropDoc
              name="badge"
              type="string | null"
              defaultValue='"Upgrade"'
              description="Small badge rendered above the title; set to null to hide"
            />
            <PropDoc
              name="highlightLabel"
              type="string"
              defaultValue='"Everything in Free, plus"'
              description="Label displayed before each plan's feature list"
            />
            <PropDoc
              name="finePrint"
              type="string"
              description="Fine print text displayed underneath the plan grid"
            />
            <PropDoc
              name="supportEmail"
              type="string"
              description="Adds a support callout with a clickable mailto link"
            />
            <PropDoc
              name="supportLabel"
              type="string"
              defaultValue='"Need help? Reach out:"'
              description="Label shown before the support email link"
            />
            <PropDoc
              name="footer"
              type="React.ReactNode"
              description="Custom footer content (secondary actions, guarantees, etc.)"
            />
            <PropDoc
              name="className"
              type="string"
              description="Extra classes applied to the dialog content wrapper"
            />
            <PropDoc
              name="contentClassName"
              type="string"
              description="Extra classes for the inner content layout"
            />
            <PropDoc
              name="planCardClassName"
              type="string"
              description="Extra classes appended to every plan card"
            />
            <PropDoc
              name="showCloseButton"
              type="boolean"
              defaultValue="true"
              description="Toggle the default top-right close button"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50">
          <h3 className="text-xl font-semibold mb-4">Behavior</h3>
          <div className="space-y-4">
            <PropDoc
              name="autoCloseOnSelect"
              type="boolean"
              defaultValue="true"
              description="Automatically closes the modal when a plan CTA succeeds"
            />
            <PropDoc
              name="resetErrorsOnOpen"
              type="boolean"
              defaultValue="true"
              description="Clears pending/error state whenever the modal reopens"
            />
          </div>
        </div>

        <div className="border-2 border-primary/10 rounded-xl p-6 bg-card/50 space-y-3">
          <h3 className="text-xl font-semibold">UpgradePlan fields</h3>
          <p className="text-sm text-muted-foreground">
            Each entry in <code>plans</code> accepts the following properties:
          </p>
          <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
            <li>
              <code>id</code>: unique identifier used for analytics callbacks
              and pending/error state tracking.
            </li>
            <li>
              <code>name</code>, <code>description</code>, <code>price</code>,{" "}
              <code>period</code>, <code>badge</code>, <code>highlight</code>,{" "}
              <code>footnote</code>: text content for the plan card.
            </li>
            <li>
              <code>features</code>: array of strings or{" "}
              <code>{`{ label, included?, footnote? }`}</code> objects to render
              capability lists.
            </li>
            <li>
              <code>ctaLabel</code>, <code>ctaHref</code>,{" "}
              <code>ctaPendingLabel</code>: customize primary CTA text and link
              behavior.
            </li>
            <li>
              <code>onSelect</code>, <code>onSelectSuccess</code>,{" "}
              <code>onSelectError</code>: async handler and hooks for custom
              upgrade flows.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
