# Contributing to Feature Lock

Thank you for your interest in contributing to Feature Lock! This document provides guidelines and information for contributors.

## 🌟 Ways to Contribute

### 1. Report Bugs
- Use the GitHub issue tracker
- Include reproduction steps
- Provide environment details (React version, browser, etc.)
- Add screenshots or recordings if applicable

### 2. Suggest Features
- Open a GitHub discussion first
- Explain the use case
- Consider alternatives
- Be open to feedback

### 3. Improve Documentation
- Fix typos or unclear sections
- Add more examples
- Improve API descriptions
- Translate to other languages (future)

### 4. Submit Code
- Bug fixes
- New features (after discussion)
- Performance improvements
- Accessibility enhancements
- New components for the Feature Lock family

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Getting Started

```bash
# 1. Fork the repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/feature-lock.git
cd feature-lock

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000
```

### Project Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Run production build

# Registry
npm run gen:registry     # Generate component registry

# Linting (when configured)
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript check
```

## 📁 Project Structure

```
feature-lock/
├── components/
│   └── blurWrapper/
│       ├── blur-wrapper.tsx      # BlurWrapper component
│       └── README.md             # Component documentation
├── app/
│   ├── page.tsx                 # Demo homepage
│   ├── docs/page.tsx            # Documentation page
│   ├── blog/page.tsx            # Blog post
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── api/
│       └── registry/            # Registry API endpoints
├── scripts/
│   ├── gen-registry.mjs         # Registry generator script
│   └── registry.config.mjs      # Component registry config
├── registry/                    # Generated registry files
│   ├── registry.json            # Component manifest
│   └── r/                       # Individual components
├── public/                      # Static assets
└── [config files]               # Next.js, TypeScript, etc.
```

## 🔧 Making Changes

### 1. Create a Branch

```bash
# For bug fixes
git checkout -b fix/issue-description

# For features
git checkout -b feature/feature-name

# For docs
git checkout -b docs/what-you-changed

# For new components
git checkout -b component/component-name
```

### 2. Make Your Changes

#### Adding a New Component

1. **Create the component directory**
   ```bash
   mkdir -p components/yourComponent
   ```

2. **Create the component file**
   ```
   components/yourComponent/your-component.tsx
   ```

3. **Add component README**
   ```
   components/yourComponent/README.md
   ```

4. **Update registry config**
   ```javascript
   // scripts/registry.config.mjs
   {
     name: "your-component",
     fileName: "your-component.json",
     type: "registry:ui",
     dependencies: { /* ... */ },
     include: [/^components\/yourComponent\/.*\.tsx$/],
     registryDependencies: ["button", "dialog"],
   }
   ```

5. **Generate registry**
   ```bash
   npm run gen:registry
   ```

#### Component Changes
- Edit component files in `components/`
- Update types and props
- Maintain backward compatibility
- Test thoroughly

#### Documentation Changes
- Update component README.md
- Update `app/docs/page.tsx`
- Keep examples current
- Test all code snippets

#### Demo Changes
- Update `app/page.tsx`
- Ensure interactive elements work
- Test accessibility
- Verify analytics events

### 3. Test Your Changes

#### Manual Testing Checklist
- [ ] Component renders correctly
- [ ] All modes/variants work
- [ ] Async operations work
- [ ] Error states display
- [ ] Loading states show
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Registry installation works

#### Test the Registry
```bash
# Generate registry
npm run gen:registry

# Test installation locally
cd ../test-project
npx shadcn@latest add http://localhost:3000/r/your-component
```

### 4. Commit Your Changes

Use clear, descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Good commits
git commit -m "fix(blur-wrapper): prevent focus trap when overlay closes"
git commit -m "feat(blur-wrapper): add customizable error messages"
git commit -m "docs: clarify async handling in examples"
git commit -m "feat(paywall-banner): add new banner component"

# Component scope examples
git commit -m "fix(blur-wrapper): ..."
git commit -m "feat(paywall-banner): ..."
git commit -m "docs(registry): ..."
```

### 5. Push and Create PR

```bash
git push origin your-branch-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference related issues
- Screenshots/recordings for UI changes
- Explanation of breaking changes (if any)
- Link to demo/preview if applicable

## 📝 Code Style

### TypeScript
- Use TypeScript for all new code
- Export types for public APIs
- Avoid `any` types
- Use strict mode
- Document complex types with JSDoc

### React
- Use functional components
- Prefer hooks over classes
- Use `"use client"` directive when needed
- Keep components focused and small
- Extract reusable logic into hooks

### Naming Conventions
- Components: PascalCase (`BlurWrapper`, `PaywallBanner`)
- Files: kebab-case (`blur-wrapper.tsx`, `paywall-banner.tsx`)
- Directories: camelCase (`blurWrapper`, `paywallBanner`)
- Props: camelCase (`isBlurred`, `overlayMode`)
- CSS classes: Tailwind utilities

### Component Structure

```tsx
"use client"

import * as React from "react"

export type MyComponentProps = {
  /** Controls the visibility state */
  isVisible?: boolean
  /** Callback when state changes */
  onVisibilityChange?: (visible: boolean) => void
  /** Child elements to render */
  children: React.ReactNode
}

/**
 * MyComponent provides a simple example structure
 * 
 * @example
 * ```tsx
 * <MyComponent isVisible onVisibilityChange={console.log}>
 *   <p>Content</p>
 * </MyComponent>
 * ```
 */
export default function MyComponent({
  isVisible = false,
  onVisibilityChange,
  children,
}: MyComponentProps) {
  // Implementation
  return <div>{children}</div>
}
```

### Comments
- Use JSDoc for public APIs
- Comment complex logic
- Explain "why" not "what"
- Keep comments updated
- Add accessibility notes

## 🧪 Testing Guidelines

### What to Test
- Core functionality
- Edge cases
- Error states
- Accessibility
- Performance
- Mobile/touch interactions
- Registry installation

### Manual Testing
1. Test in Chrome, Firefox, Safari
2. Test on mobile devices
3. Test with keyboard only
4. Test with screen reader
5. Test with slow network
6. Test registry installation

## 🎨 Design Guidelines

### Accessibility First
- Use semantic HTML
- Include ARIA labels
- Support keyboard navigation
- Announce state changes
- Focus management
- Color contrast compliance

### Visual Design
- Follow Tailwind conventions
- Support dark mode
- Ensure sufficient contrast
- Use responsive breakpoints
- Keep animations smooth
- Consistent spacing

### UX Principles
- Don't interrupt user flow
- Provide clear feedback
- Handle errors gracefully
- Show loading states
- Allow easy dismissal
- Contextual help

## 📚 Documentation Standards

### Component Documentation
Each component needs:
- Purpose and use cases
- Installation instructions
- Basic usage example
- All props documented (with types)
- Advanced examples
- Accessibility notes
- Best practices
- Troubleshooting

### Code Examples
- Complete, runnable code
- Include all imports
- Show real use cases
- Comment complex parts
- Test before committing
- Multiple difficulty levels

### Documentation Structure
```markdown
# Component Name

Brief description

## Installation
## Usage
## Props
## Examples
## Accessibility
## Best Practices
## Troubleshooting
```

## 🔍 Review Process

### What We Look For
1. **Functionality**: Does it work as intended?
2. **Code Quality**: Is it well-written and maintainable?
3. **Documentation**: Are changes documented?
4. **Testing**: Is it thoroughly tested?
5. **Accessibility**: Does it work for everyone?
6. **Performance**: Is it efficient?
7. **Breaking Changes**: Are they necessary and documented?
8. **Registry**: Can it be installed via registry?

### Response Time
- Initial review: Within 3 days
- Follow-up reviews: Within 2 days
- Merge time: Varies by complexity

## ❓ Questions?

- **General questions**: Open a GitHub discussion
- **Bug reports**: Open a GitHub issue
- **Feature requests**: Open a GitHub discussion
- **New components**: Open a discussion first
- **Security issues**: Email security@griffenlabs.com

## 🎉 Recognition

Contributors will be:
- Listed in [CONTRIBUTORS.md](./CONTRIBUTORS.md)
- Mentioned in release notes
- Acknowledged in documentation
- Credited in component files

## 🚀 Roadmap

See our [project roadmap](./README.md#-project-roadmap) for upcoming features and components.

Interested in building:
- PaywallBanner component?
- UpgradeModal component?
- FeatureTooltip component?
- UsageProgress component?

Open a discussion to claim a component!

---

Thank you for making Feature Lock better! 🙏

**Happy coding!** 🔒

*Last updated: December 2024*
