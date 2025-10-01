"use client"

import { ArrowLeft, Code, Lock, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BlogPost() {
  return (
    <div className="font-sans min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="p-8 pb-20 sm:p-20">
        <article className="mx-auto max-w-3xl space-y-8">
          <Link href="/">
            <Button variant="ghost" className="mb-8 -ml-4 text-primary hover:text-primary/80 hover:bg-primary/5">
              <ArrowLeft className="mr-2 size-4" />
              Back to demo
            </Button>
          </Link>

          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium mb-2">
              <Sparkles className="size-3" />
              <span>Component Design</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
              BlurWrapper: Contextual Upsells That Don't Interrupt Flow
            </h1>
            <p className="text-xl text-muted-foreground">
              How we built a reusable React component for in-context feature locking with async actions, full
              accessibility, and elegant UX.
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              The Problem
            </h2>
            <p className="text-muted-foreground">
              Traditional paywalls pull users out of their workflow. You click "Export Report," and suddenly you're on a
              pricing page. The context is lost. The feature you wanted feels distant. You might not even remember why
              you clicked.
            </p>

            <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg not-prose my-8">
              <div className="flex items-start gap-3">
                <Lock className="size-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    What if the upgrade prompt appeared right on top of the locked feature?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    That's the idea behind BlurWrapper. Blur the unavailable section, show a clear upgrade affordance
                    exactly where the user needs it, and let them unlock it without leaving the page.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Design Goals
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-foreground">Context-aware:</strong> Show the upgrade prompt directly over the
                  locked content
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-foreground">Flexible:</strong> Support both dialog overlays (for critical
                  actions) and inline panels (for subtle upsells)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-foreground">Async-ready:</strong> Handle upgrade flows with loading states,
                  errors, and retries
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-foreground">Accessible:</strong> Block focus behind the blur, announce
                  loading, move focus to errors
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>
                  <strong className="text-foreground">Composable:</strong> Let developers customize messaging, visuals,
                  and confirm actions
                </span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Key Features
            </h2>

            <div className="grid md:grid-cols-2 gap-4 not-prose my-8">
              <div className="p-4 bg-card border border-primary/10 rounded-lg">
                <Code className="size-5 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Two overlay modes</h3>
                <p className="text-sm text-muted-foreground">
                  Dialog for critical actions, inline for subtle upsells. Position inline panels anywhere: center,
                  corners, edges.
                </p>
              </div>

              <div className="p-4 bg-card border border-primary/10 rounded-lg">
                <Zap className="size-5 text-primary mb-2" />
                <h3 className="font-semibold mb-1">React 19 useTransition</h3>
                <p className="text-sm text-muted-foreground">
                  Handle async upgrade flows without blocking UI. Show spinners, catch errors, unblur on success—all
                  seamlessly.
                </p>
              </div>

              <div className="p-4 bg-card border border-primary/10 rounded-lg">
                <svg className="size-5 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <h3 className="font-semibold mb-1">Focus blocking</h3>
                <p className="text-sm text-muted-foreground">
                  Use inert + aria-hidden to prevent keyboard/SR navigation behind the blur. No accidental interactions.
                </p>
              </div>

              <div className="p-4 bg-card border border-primary/10 rounded-lg">
                <Sparkles className="size-5 text-primary mb-2" />
                <h3 className="font-semibold mb-1">Screen reader support</h3>
                <p className="text-sm text-muted-foreground">
                  Pending states announced via live regions. Errors auto-focused. Keyboard shortcuts (Enter/Escape) for
                  inline panels.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Example: Inline Upgrade Panel
            </h2>

            <pre className="bg-card border border-primary/10 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-muted-foreground">{`<BlurWrapper
  isBlurred={locked}
  overlayMode="inline"
  inlinePosition="centerCenter"
  onConfirm={async () => {
    await upgradeUser()
    setLocked(false)
  }}
  onUnblur={() => setLocked(false)}
>
  <LockedFeatureContent />
</BlurWrapper>`}</code>
            </pre>

            <p className="text-muted-foreground">
              That's it. The component handles blur, dimming, focus blocking, pending UI, error messages, and unblur on
              success. You provide the async confirm logic and the unlock callback.
            </p>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Custom Overlays
            </h2>

            <p className="text-muted-foreground">
              Need full control over messaging or layout? Pass a render-prop function to the overlay prop. You'll
              receive:
            </p>

            <ul className="space-y-1 text-muted-foreground list-inside list-disc">
              <li>isPending – show loading UI</li>
              <li>error – display error messages</li>
              <li>confirm() – trigger the async action</li>
              <li>resetError() – clear errors</li>
              <li>registerErrorRef – auto-focus error container</li>
            </ul>

            <pre className="bg-card border border-primary/10 rounded-lg p-4 overflow-x-auto text-sm mt-4">
              <code className="text-muted-foreground">{`overlay={({ isPending, error, confirm, registerErrorRef }) => (
  <div>
    <h3>Unlock Advanced Reports</h3>
    {error && <div ref={registerErrorRef} role="alert">{error.message}</div>}
    <button onClick={confirm} disabled={isPending}>
      {isPending ? "Upgrading..." : "Upgrade now"}
    </button>
  </div>
)}`}</code>
            </pre>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              When to Use It
            </h2>

            <p className="text-muted-foreground">BlurWrapper shines when you want to:</p>

            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Gate premium features inline (e.g., advanced analytics, export tools)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Show upgrade prompts contextually, not on a separate pricing page</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Handle async upgrade flows (payment, API calls) with proper loading/error UX</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Maintain accessibility (focus management, SR announcements) without extra plumbing</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Try It Yourself
            </h2>

            <p className="text-muted-foreground">
              Head back to the{" "}
              <Link href="/" className="text-primary hover:text-primary/80 underline underline-offset-4">
                demo page
              </Link>{" "}
              and toggle the sections. Click "Upgrade now" to see the async flow in action. Notice how:
            </p>

            <ul className="space-y-1 text-muted-foreground list-inside list-disc">
              <li>The blurred content stays visible but inaccessible</li>
              <li>Loading states are announced to screen readers</li>
              <li>Errors are displayed inline and focused automatically</li>
              <li>The section unblurs after a successful upgrade</li>
            </ul>

            <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg not-prose my-8">
              <h3 className="font-semibold text-lg mb-2">Ready to integrate?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                The component is production-ready with TypeScript types, forwardRef support, and full test coverage.
              </p>
              <div className="flex gap-3">
                <a href="https://github.com/griffenlabs/feature-lock" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">View on GitHub</Button>
                </a>
                <Link href="/">
                  <Button variant="outline" className="border-primary/20 hover:bg-primary/5 bg-transparent">
                    Back to demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
