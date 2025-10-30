export function BestPracticesSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Best Practices
        </h2>
        <p className="text-muted-foreground">Tips for optimal implementation</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <h3 className="font-semibold mb-2">✅ Do</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Use dialog mode for critical upgrade decisions</li>
            <li>• Use inline mode for contextual feature teasers</li>
            <li>• Provide clear value propositions in overlay content</li>
            <li>
              • Persist dismissals with PaywallBanner storage keys to respect
              user intent
            </li>
            <li>• Surface UsageProgress before users hit their limits</li>
            <li>• Handle async errors gracefully</li>
            <li>• Test with keyboard navigation and screen readers</li>
          </ul>
        </div>

        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold mb-2">❌ Don&apos;t</h3>
          <ul className="space-y-1 text-sm text-red-900">
            <li>• Lock too many features at once</li>
            <li>• Use aggressive blur that makes content unrecognizable</li>
            <li>• Forget to handle loading and error states</li>
            <li>• Disable pointer events if user needs to scroll</li>
            <li>• Mix dialog and inline modes inconsistently</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
