"use client";

import { track } from "@vercel/analytics";

import { DocsInstallCommand } from "@/components/docs/install-command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function InstallationSection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Installation
        </h2>
        <p className="text-muted-foreground">
          Add Feature Lock components to your project in seconds
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">Prerequisites</h3>
          <p className="text-muted-foreground mb-4">
            Make sure you have a Next.js project with shadcn/ui set up. If not,
            initialize it first:
          </p>
          <DocsInstallCommand
            command="npx shadcn@latest init"
            index={0}
          />
        </div>

        <Tabs
          defaultValue="blur-wrapper"
          className="w-full"
          onValueChange={(value) =>
            track("docs_install_tab_changed", { component: value })
          }
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 max-w-4xl">
            <TabsTrigger value="blur-wrapper">BlurWrapper</TabsTrigger>
            <TabsTrigger value="paywall-banner">PaywallBanner</TabsTrigger>
            <TabsTrigger value="feature-tooltip">FeatureTooltip</TabsTrigger>
            <TabsTrigger value="upgrade-modal">UpgradeModal</TabsTrigger>
            <TabsTrigger value="usage-progress">UsageProgress</TabsTrigger>
          </TabsList>

          <TabsContent
            value="blur-wrapper"
            className="space-y-4 pt-4"
          >
            <p className="text-muted-foreground">
              Run the following command to install the BlurWrapper component and
              its dependencies:
            </p>
            <DocsInstallCommand
              command="npx shadcn@latest add https://feature-lock.griffen.codes/r/blur-wrapper"
              index={1}
            />
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-semibold mb-2">✨ What gets installed?</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • BlurWrapper component at @/components/blurWrapper/blur-wrapper
                </li>
                <li>• Required shadcn/ui components (Button, Dialog)</li>
                <li>
                  • All necessary peer dependencies (@radix-ui/react-dialog,
                  lucide-react)
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent
            value="paywall-banner"
            className="space-y-4 pt-4"
          >
            <p className="text-muted-foreground">
              Prefer a lightweight announcement experience? Install PaywallBanner
              with this command:
            </p>
            <DocsInstallCommand
              command="npx shadcn@latest add https://feature-lock.griffen.codes/r/paywall-banner"
              index={5}
            />
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-semibold mb-2">✨ What gets installed?</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • PaywallBanner component at @/components/paywallBanner/paywall-banner
                </li>
                <li>• Required shadcn/ui components (Button, Badge)</li>
                <li>
                  • lucide-react icons for the default announcement glyphs
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent
            value="feature-tooltip"
            className="space-y-4 pt-4"
          >
            <p className="text-muted-foreground">
              Need subtle inline upsells? FeatureTooltip installs with this
              command:
            </p>
            <DocsInstallCommand
              command="npx shadcn@latest add https://feature-lock.griffen.codes/r/feature-tooltip"
              index={7}
            />
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-semibold mb-2">✨ What gets installed?</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • FeatureTooltip component at @/components/featureTooltip/feature-tooltip
                </li>
                <li>• Tooltip UI primitive at @/components/ui/tooltip</li>
                <li>
                  • lucide-react icons for the default lock/highlight styles
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent
            value="upgrade-modal"
            className="space-y-4 pt-4"
          >
            <p className="text-muted-foreground">
              Present a full plan comparison experience with UpgradeModal:
            </p>
            <DocsInstallCommand
              command="npx shadcn@latest add https://feature-lock.griffen.codes/r/upgrade-modal"
              index={14}
            />
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-semibold mb-2">✨ What gets installed?</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • UpgradeModal component at @/components/upgradeModal/upgrade-modal
                </li>
                <li>
                  • Reuses existing shadcn/ui dialog + button primitives
                </li>
                <li>
                  • lucide-react icons for plan highlights & pending states
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent
            value="usage-progress"
            className="space-y-4 pt-4"
          >
            <p className="text-muted-foreground">
              Visualize quotas and drive upgrades with UsageProgress:
            </p>
            <DocsInstallCommand
              command="npx shadcn@latest add https://feature-lock.griffen.codes/r/usage-progress"
              index={16}
            />
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <h4 className="font-semibold mb-2">✨ What gets installed?</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  • UsageProgress component at @/components/usageProgress/usage-progress
                </li>
                <li>
                  • Shared progress bar helper at @/components/usageProgress/usage-progress-bar
                </li>
                <li>
                  • No extra primitives needed—works with existing shadcn/ui buttons & badges
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
