export default {
  outDir: "registry",
  baseUrl: process.env.NEXT_PUBLIC_REGISTRY_URL || "https://feature-lock.griffen.codes/api/registry",
  
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
    // Map source paths to installation paths
    if (fromPath.startsWith("components/")) {
      return `@/${fromPath}`;
    }
    if (fromPath.startsWith("lib/")) {
      return `@/${fromPath}`;
    }
    if (fromPath.startsWith("hooks/")) {
      return `@/${fromPath}`;
    }
    return `@/${fromPath}`;
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
    }
  ],
};
