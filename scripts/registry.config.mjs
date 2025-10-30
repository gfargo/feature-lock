export default {
  outDir: "registry",
  baseUrl: process.env.NEXT_PUBLIC_REGISTRY_URL || "https://feature-lock.griffen.codes",
  
  defaults: {
    dependencies: {
      "react": "^19.0.0",
      "lucide-react": "^0.454.0",
      "class-variance-authority": "^0.7.1",
      "clsx": "^2.1.1",
      "tailwind-merge": "^3.3.1",
    }
  },
  
  pathRewriter: (fromPath) => {
    // Transform source paths to relative installation paths (shadcn/ui format)
    const mappings = {
      'components/': 'components/',
      'lib/': 'lib/',
      'hooks/': 'hooks/',
      'types/': 'types/',
    };

    for (const [from, to] of Object.entries(mappings)) {
      if (fromPath.startsWith(from)) {
        return fromPath.replace(from, to);
      }
    }

    // Fallback: return path as-is for relative paths
    return fromPath;
  },

  items: [
    {
      name: "blur-wrapper",
      fileName: "blur-wrapper.json",
      type: "registry:ui",
      dependencies: {
        "@radix-ui/react-dialog": "1.1.4",
      },
      include: [
        /^components\/blurWrapper\/blur-wrapper\.tsx$/,
      ],
      exclude: [
        /^components\/blurWrapper\/README\.md$/,
      ],
      registryDependencies: ["button", "dialog"],
    },
    {
      name: "blur-wrapper-full",
      fileName: "blur-wrapper-full.json",
      type: "registry:ui",
      dependencies: {
        "@radix-ui/react-dialog": "1.1.4",
      },
      include: [
        /^components\/blurWrapper\/blur-wrapper\.tsx$/,
        /^components\/blurWrapper\/README\.md$/,
      ],
      exclude: [],
      registryDependencies: ["button", "dialog"],
    },
    {
      name: "paywall-banner",
      fileName: "paywall-banner.json",
      type: "registry:ui",
      dependencies: {},
      include: [
        /^components\/paywallBanner\/paywall-banner\.tsx$/,
      ],
      exclude: [
        /^components\/paywallBanner\/README\.md$/,
      ],
      registryDependencies: ["button", "badge"],
    },
    {
      name: "paywall-banner-full",
      fileName: "paywall-banner-full.json",
      type: "registry:ui",
      dependencies: {},
      include: [
        /^components\/paywallBanner\/paywall-banner\.tsx$/,
        /^components\/paywallBanner\/README\.md$/,
      ],
      exclude: [],
      registryDependencies: ["button", "badge"],
    },
    {
      name: "feature-tooltip",
      fileName: "feature-tooltip.json",
      type: "registry:ui",
      dependencies: {},
      include: [
        /^components\/featureTooltip\/feature-tooltip\.tsx$/,
        /^components\/ui\/tooltip\.tsx$/,
      ],
      exclude: [
        /^components\/featureTooltip\/README\.md$/,
      ],
      registryDependencies: ["button", "badge"],
    },
    {
      name: "feature-tooltip-full",
      fileName: "feature-tooltip-full.json",
      type: "registry:ui",
      dependencies: {},
      include: [
        /^components\/featureTooltip\/feature-tooltip\.tsx$/,
        /^components\/featureTooltip\/README\.md$/,
        /^components\/ui\/tooltip\.tsx$/,
      ],
      exclude: [],
      registryDependencies: ["button", "badge"],
    },
    {
      name: "upgrade-modal",
      fileName: "upgrade-modal.json",
      type: "registry:ui",
      dependencies: {
        "@radix-ui/react-dialog": "1.1.4",
      },
      include: [
        /^components\/upgradeModal\/upgrade-modal\.tsx$/,
      ],
      exclude: [
        /^components\/upgradeModal\/README\.md$/,
      ],
      registryDependencies: ["button", "badge"],
    },
    {
      name: "upgrade-modal-full",
      fileName: "upgrade-modal-full.json",
      type: "registry:ui",
      dependencies: {
        "@radix-ui/react-dialog": "1.1.4",
      },
      include: [
        /^components\/upgradeModal\/upgrade-modal\.tsx$/,
        /^components\/upgradeModal\/README\.md$/,
      ],
      exclude: [],
      registryDependencies: ["button", "badge"],
    },
    {
      name: "usage-progress",
      fileName: "usage-progress.json",
      type: "registry:ui",
      dependencies: {},
      include: [
        /^components\/usageProgress\/usage-progress\.tsx$/,
        /^components\/usageProgress\/usage-progress-bar\.tsx$/,
      ],
      exclude: [
        /^components\/usageProgress\/README\.md$/,
      ],
      registryDependencies: ["button", "badge"],
    },
    {
      name: "usage-progress-full",
      fileName: "usage-progress-full.json",
      type: "registry:ui",
      dependencies: {},
      include: [
        /^components\/usageProgress\/usage-progress\.tsx$/,
        /^components\/usageProgress\/usage-progress-bar\.tsx$/,
        /^components\/usageProgress\/README\.md$/,
      ],
      exclude: [],
      registryDependencies: ["button", "badge"],
    },
    {
      name: "age-gate",
      fileName: "age-gate.json",
      type: "registry:ui",
      dependencies: {
        "@radix-ui/react-dialog": "1.1.4",
      },
      include: [
        /^components\/ageGate\/age-gate\.tsx$/,
      ],
      exclude: [
        /^components\/ageGate\/README\.md$/,
      ],
      registryDependencies: ["button", "dialog", "input", "label"],
    },
    {
      name: "age-gate-full",
      fileName: "age-gate-full.json",
      type: "registry:ui",
      dependencies: {
        "@radix-ui/react-dialog": "1.1.4",
      },
      include: [
        /^components\/ageGate\/age-gate\.tsx$/,
        /^components\/ageGate\/README\.md$/,
      ],
      exclude: [],
      registryDependencies: ["button", "dialog", "input", "label"],
    },
  ],
};
