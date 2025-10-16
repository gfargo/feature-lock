"use client"


const BENEFITS = [
  {
    title: "🎯 Context-aware upsells",
    description: "Use the right pattern for every upsell—from blurred content and inline tooltips to banners and modals.",
  },
  {
    title: "♿ Accessible by default",
    description: "Radix primitives, focus management, and ARIA helpers keep each component inclusive out of the box.",
  },
  {
    title: "⚡ Async-ready",
    description: "Built-in loading, error recovery, and analytics hooks make wiring real billing flows painless.",
  },
  {
    title: "🎨 Flexible styling",
    description: "Tailwind-friendly APIs, render props, and composable primitives adapt to any product surface.",
  },
]

export function FeatureBenefits() {
  return (
    <section className="rounded-2xl border border-primary/10 bg-card/50 p-8 backdrop-blur-sm">
      <h2 className="mb-6 text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Why Feature Lock?
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {BENEFITS.map((benefit) => (
          <div key={benefit.title} className="rounded-lg border border-primary/20 bg-primary/10 p-4">
            <h3 className="mb-2 font-semibold">{benefit.title}</h3>
            <p className="text-sm text-muted-foreground">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
