# Installing BlurWrapper

BlurWrapper is available as a component that can be installed via the ShadcnUI CLI.

## Prerequisites

Make sure you have a Next.js project with shadcn/ui set up:

\`\`\`bash
npx shadcn@latest init
\`\`\`

## Installation

### Option 1: Install Component Only

Install just the BlurWrapper component (recommended):

\`\`\`bash
npx shadcn@latest add https://feature-lock.griffen.codes/r/blur-wrapper
\`\`\`

This will install:
- The BlurWrapper component
- Required dependencies (Dialog, Button from shadcn/ui)
- All necessary peer dependencies

### Option 2: Install with Documentation

Install the component with its README documentation:

\`\`\`bash
npx shadcn@latest add https://feature-lock.griffen.codes/r/blur-wrapper-full
\`\`\`

## Usage

After installation, import and use the component:

\`\`\`tsx
import BlurWrapper from "@/components/blurWrapper/blur-wrapper"

function MyComponent() {
  const [locked, setLocked] = useState(true)

  return (
    <BlurWrapper
      isBlurred={locked}
      overlayMode="inline"
      inlinePosition="centerCenter"
      onConfirm={async () => {
        // Your upgrade logic
        await upgradeUser()
        setLocked(false)
      }}
      onUnblur={() => setLocked(false)}
    >
      <YourLockedContent />
    </BlurWrapper>
  )
}
\`\`\`

## Component Props

See the [README](../components/blurWrapper/README.md) for full API documentation.

## Examples

Check out the [demo page](https://feature-lock.griffen.codes) for interactive examples.

## Troubleshooting

### Import errors

Make sure your `tsconfig.json` has the correct path aliases:

\`\`\`json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
\`\`\`

### Missing dependencies

If you see dependency errors, install them manually:

\`\`\`bash
npm install @radix-ui/react-dialog lucide-react
\`\`\`

### Styling issues

Ensure you have the shadcn/ui setup complete with Tailwind CSS configured.

## Local Development

To test the registry locally:

1. Clone the repository
2. Run `npm install`
3. Run `npm run gen:registry`
4. Run `npm run dev`
5. Test installation: `npx shadcn@latest add http://localhost:3000/r/blur-wrapper`

## Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/yourusername/blur-wrapper)
- Read the [blog post](https://feature-lock.griffen.codes/blog) for design rationale
- Check the [demo](https://feature-lock.griffen.codes) for usage examples
