# Component Registry Documentation

This project uses a ShadcnUI-compatible component registry system that allows developers to install components using the familiar `npx shadcn@latest add` pattern.

## Architecture

### Registry Structure

```
project/
├── scripts/
│   ├── registry.config.mjs    # Component definitions
│   └── gen-registry.mjs        # Registry generator
├── registry/                   # Generated files
│   ├── registry.json           # Manifest
│   └── r/                      # Component definitions
│       ├── blur-wrapper.json
│       └── blur-wrapper-full.json
└── app/api/registry/          # API endpoints
    ├── route.ts               # Manifest endpoint
    └── r/[name]/route.ts      # Component endpoint
```

### How It Works

1. **Configuration** (`scripts/registry.config.mjs`)
   - Defines which files belong to each component
   - Specifies dependencies and registry dependencies
   - Maps source paths to installation targets

2. **Generation** (`scripts/gen-registry.mjs`)
   - Scans project files
   - Matches files against include/exclude patterns
   - Generates JSON definitions for each component
   - Creates registry manifest

3. **API Routes** (`app/api/registry/*`)
   - Serves registry manifest and component definitions
   - Populates file contents dynamically
   - Handles caching and error cases

4. **Installation** (via ShadcnUI CLI)
   - User runs `npx shadcn@latest add <url>`
   - CLI fetches component definition from API
   - Installs files to specified target paths
   - Resolves and installs dependencies

## Adding New Components

To add a new component to the registry:

1. **Create the component** in your project structure
2. **Add to registry config**:

```javascript
// scripts/registry.config.mjs
{
  name: "my-component",
  fileName: "my-component.json",
  type: "registry:ui",
  dependencies: {
    // Component-specific dependencies
  },
  include: [
    /^components\/myComponent\/.*\.tsx$/,
  ],
  exclude: [
    /.*\.test\.tsx$/,
  ],
  registryDependencies: ["button", "dialog"],
}
```

3. **Generate the registry**:

```bash
npm run gen:registry
```

4. **Test the installation**:

```bash
npx shadcn@latest add http://localhost:3000/r/my-component
```

## Deployment

### Environment Variables

Set the registry base URL for production:

```env
NEXT_PUBLIC_REGISTRY_URL=https://feature-lock.griffen.codes/api/registry
```

### Build Process

The registry is automatically generated during build:

```bash
npm run build  # Runs gen:registry as prebuild step
```

### Vercel Deployment

The API routes work out of the box on Vercel. Make sure:
- `registry/` directory is committed to git
- Environment variables are set in Vercel dashboard
- API routes are not excluded in `vercel.json`

## Maintenance

### Updating Dependencies

When you update package.json dependencies:

1. Update `registry.config.mjs` with new versions
2. Run `npm run gen:registry`
3. Commit the updated registry files

### Versioning Components

To support multiple versions:

1. Add version to component config:
```javascript
{
  name: "blur-wrapper",
  version: "2.0.0",
  // ...
}
```

2. Create separate JSON files for each version
3. Update manifest to include version info

## Testing

### Local Testing

```bash
# Generate registry
npm run gen:registry

# Start dev server
npm run dev

# Test installation in another project
cd ../test-project
npx shadcn@latest add http://localhost:3000/r/blur-wrapper
# Or test production:
npx shadcn@latest add https://feature-lock.griffen.codes/r/blur-wrapper
```

### Validation

Check generated JSON files:

```bash
# View manifest
cat registry/registry.json

# View component definition
cat registry/r/blur-wrapper.json

# Test API endpoint
curl http://localhost:3000/api/registry/r/blur-wrapper
```

## Troubleshooting

### Registry not found error

- Run `npm run gen:registry`
- Check that `registry/` directory exists
- Verify API routes are working

### Component not found

- Check component name in URL matches fileName in config
- Verify include patterns match your files
- Look for errors in generator output

### Installation fails

- Verify API routes are accessible
- Check component JSON structure
- Ensure dependencies are correctly specified

### Import errors after installation

- Check path rewriter configuration
- Verify tsconfig.json path aliases
- Ensure target paths are correct

## Best Practices

1. **File Organization**: Keep related components together
2. **Naming Conventions**: Use kebab-case for file names
3. **Dependencies**: Only include necessary dependencies
4. **Documentation**: Include README with each component
5. **Testing**: Test installation before deploying
6. **Versioning**: Use semantic versioning for components
7. **Caching**: API routes include cache headers for performance

## Resources

- [ShadcnUI CLI Documentation](https://ui.shadcn.com/docs/cli)
- [Registry Schema](https://ui.shadcn.com/docs/registry)
- [Blog Post](https://feature-lock.griffen.codes/blog) - Design and implementation details
