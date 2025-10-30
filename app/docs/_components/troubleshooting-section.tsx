import { DocsCodeBlock } from "@/components/docs/code-block";

export function TroubleshootingSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Troubleshooting
        </h2>
        <p className="text-muted-foreground">Common issues and solutions</p>
      </div>

      <div className="space-y-4">
        <div className="border-l-4 border-primary/50 bg-muted/50 p-4 rounded-r-lg">
          <h3 className="font-semibold mb-2">Import errors</h3>
          <p className="text-sm text-muted-foreground mb-2">
            If you see &ldquo;Cannot find module&rdquo; errors, verify your
            tsconfig.json has correct path aliases:
          </p>
          <DocsCodeBlock
            index={12}
            type="troubleshooting_imports"
            code={`{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}`}
          />
        </div>

        <div className="border-l-4 border-primary/50 bg-muted/50 p-4 rounded-r-lg">
          <h3 className="font-semibold mb-2">Blur not visible</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Ensure your content has a non-transparent background. The blur
            effect works by filtering the content:
          </p>
          <DocsCodeBlock
            index={13}
            type="troubleshooting_blur"
            code={`<BlurWrapper isBlurred={locked}>
  <div className="bg-white dark:bg-slate-900 p-6 rounded-lg">
    {/* Your content */}
  </div>
</BlurWrapper>`}
          />
        </div>

        <div className="border-l-4 border-primary/50 bg-muted/50 p-4 rounded-r-lg">
          <h3 className="font-semibold mb-2">Overlay not showing</h3>
          <p className="text-sm text-muted-foreground">
            By default, the overlay shows automatically when isBlurred is true.
            If it&apos;s not appearing, check that showOverlayOnBlur is not set
            to false.
          </p>
        </div>

        <div className="border-l-4 border-primary/50 bg-muted/50 p-4 rounded-r-lg">
          <h3 className="font-semibold mb-2">TypeScript errors</h3>
          <p className="text-sm text-muted-foreground">
            Make sure you&apos;re using TypeScript 5+ and have proper type
            definitions installed. The component is fully typed with
            TypeScript.
          </p>
        </div>
      </div>
    </section>
  );
}
