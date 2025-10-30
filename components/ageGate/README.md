# Age Gate

A configurable age verification dialog component for React applications that need to verify user age before allowing access to age-restricted content.

## Features

- **Multiple verification methods**: Simple confirmation, birthdate entry, or custom verification
- **Persistent verification**: Remember user's verification choice using localStorage or sessionStorage
- **Accessible**: Built with proper ARIA attributes, focus management, and screen reader support
- **Async-ready**: Supports async verification callbacks with loading states
- **Customizable**: Flexible styling, labels, and verification logic
- **TypeScript**: Full type safety with comprehensive prop types

## Installation

```bash
npx shadcn@latest add https://feature-lock.griffen.codes/r/age-gate
```

## Usage

### Simple Age Verification

```tsx
import AgeGate from "@/components/ageGate/age-gate"

function App() {
  const [showAgeGate, setShowAgeGate] = useState(true)

  return (
    <div>
      <AgeGate
        open={showAgeGate}
        onOpenChange={setShowAgeGate}
        onVerified={() => console.log("User verified as 18+")}
        onDenied={() => console.log("User denied access")}
      />
      
      {/* Your age-restricted content */}
      <div>Age-restricted content here</div>
    </div>
  )
}
```

### Birthdate Verification

```tsx
<AgeGate
  method="birthdate"
  minimumAge={21}
  rememberVerification={true}
  onVerified={(age) => {
    console.log(`User is ${age} years old`)
    // Allow access to content
  }}
  onDenied={() => {
    // Redirect to age-appropriate content
    window.location.href = "/under-21"
  }}
/>
```

### Custom Verification

```tsx
<AgeGate
  method="custom"
  customVerification={({ onVerify, isPending, error }) => (
    <div className="space-y-4">
      <p>Please verify your identity to continue.</p>
      {error && <div className="text-red-600">Verification failed</div>}
      <div className="flex gap-2">
        <Button 
          onClick={() => onVerify(true)}
          disabled={isPending}
        >
          I'm verified
        </Button>
        <Button 
          onClick={() => onVerify(false)}
          variant="outline"
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </div>
  )}
/>
```

### With Persistence

```tsx
<AgeGate
  method="birthdate"
  rememberVerification={true}
  storageKey="wine-shop-age-verification"
  storageType="localStorage" // or "sessionStorage" or "cookie"
  onVerified={() => {
    // User verification will be remembered
    setCanAccessWineShop(true)
  }}
/>
```

### With Cookie Storage

```tsx
<AgeGate
  method="simple"
  rememberVerification={true}
  storageKey="age-verified"
  storageType="cookie"
  cookieOptions={{
    maxAge: 60 * 60 * 24 * 30, // 30 days
    domain: ".example.com",
    secure: true,
    sameSite: "lax"
  }}
  onVerified={() => {
    setAgeVerified(true)
  }}
/>
```

### With Custom Content

```tsx
<AgeGate
  method="birthdate"
  minimumAge={21}
  onVerified={() => setCanPurchaseAlcohol(true)}
>
  <div className="space-y-3 text-sm text-gray-600">
    <p>
      <strong>Legal Notice:</strong> By proceeding, you confirm that you are of legal drinking age 
      in your jurisdiction and agree to our terms of service.
    </p>
    <div className="flex flex-wrap gap-4">
      <a href="/terms" className="text-blue-600 hover:underline">
        Terms of Service
      </a>
      <a href="/privacy" className="text-blue-600 hover:underline">
        Privacy Policy
      </a>
      <a href="/age-verification-policy" className="text-blue-600 hover:underline">
        Age Verification Policy
      </a>
    </div>
    <p className="text-xs">
      This verification is required by federal and state regulations.
    </p>
  </div>
</AgeGate>
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `undefined` | Controls dialog visibility (controlled mode) |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Called when dialog open state changes |
| `minimumAge` | `number` | `18` | Minimum age required for verification |
| `method` | `"simple" \| "birthdate" \| "custom"` | `"simple"` | Age verification method |
| `rememberVerification` | `boolean` | `false` | Whether to remember verification in storage |
| `storageKey` | `string` | `"age-gate-verified"` | Key used for storing verification |
| `storageType` | `"localStorage" \| "sessionStorage" \| "cookie"` | `"localStorage"` | Storage method for verification |
| `cookieOptions` | `CookieOptions` | `{}` | Cookie configuration when using cookie storage |
| `children` | `ReactNode` | `undefined` | Custom content to display in the dialog |
| `onVerified` | `(age?: number) => Promise<void> \| void` | `undefined` | Called when age is successfully verified |
| `onDenied` | `() => Promise<void> \| void` | `undefined` | Called when age verification is denied |
| `onError` | `(error: unknown) => void` | `undefined` | Called when verification encounters an error |
| `customVerification` | `(args: CustomVerificationRenderArgs) => ReactNode` | `undefined` | Custom verification UI renderer |
| `allowCancel` | `boolean` | `true` | Whether to show cancel/deny buttons |
| `autoCloseOnVerify` | `boolean` | `true` | Auto-close dialog after successful verification |
| `labels` | `Partial<AgeGateLabels>` | `{}` | Custom labels for all text content |
| `icon` | `LucideIcon` | `Shield` | Icon displayed in dialog header |

### Verification Methods

#### Simple Method
- Shows a simple "I am 18 or older" confirmation button
- Best for basic age gates where exact age isn't needed
- Fastest user experience

#### Birthdate Method  
- Requires user to enter their date of birth
- Calculates exact age and passes it to `onVerified`
- More secure but requires more user input
- Validates date format and calculates age accurately

#### Custom Method
- Provides full control over verification UI and logic
- Use `customVerification` prop to render your own interface
- Receive helper functions for state management and callbacks

### Storage Behavior

When `rememberVerification` is enabled:
- Verification status is stored using the specified storage method
- `storageType="localStorage"` (default): Persists across browser sessions
- `storageType="sessionStorage"`: Cleared when tab closes
- `storageType="cookie"`: Stored as HTTP cookie with configurable options
- Storage key can be customized with `storageKey` prop
- Stored verification is checked on component mount

#### Cookie Options

When using `storageType="cookie"`, you can configure:

```typescript
type CookieOptions = {
  domain?: string        // Cookie domain (e.g., ".example.com")
  path?: string         // Cookie path (default: "/")
  secure?: boolean      // Require HTTPS
  sameSite?: "strict" | "lax" | "none"  // SameSite policy
  maxAge?: number       // Expiration in seconds
  expires?: Date        // Explicit expiration date
}
```

Default cookie options:
- `maxAge`: 1 year (31,536,000 seconds)
- `path`: "/"
- `sameSite`: "lax"

### Custom Content

The `children` prop allows you to add custom content between the description and verification form:

- **Legal disclaimers**: Required notices and compliance text
- **Links**: Terms of service, privacy policy, age verification policy
- **Regulatory information**: State law requirements, authority references
- **Custom styling**: Branded content or additional context

The children content is rendered in a bordered section to visually separate it from the form controls.

### Accessibility Features

- Proper ARIA attributes and roles
- Focus management for error states
- Screen reader announcements for loading states
- Keyboard navigation support
- High contrast error styling

### Error Handling

The component handles various error scenarios:
- Invalid date formats in birthdate method
- Network errors in async callbacks
- Storage access failures (gracefully degrades)
- Custom error messages via `labels.error`

## Styling

The component uses Tailwind CSS classes and can be customized via:
- `className` prop for container styling
- `labels` prop for all text content
- CSS custom properties for theme integration
- Standard shadcn/ui component styling patterns

## Examples

### E-commerce Wine Shop

```tsx
function WineShop() {
  const [ageVerified, setAgeVerified] = useState(false)
  
  return (
    <>
      <AgeGate
        open={!ageVerified}
        method="birthdate"
        minimumAge={21}
        rememberVerification={true}
        storageKey="wine-shop-verification"
        storageType="cookie"
        cookieOptions={{
          maxAge: 60 * 60 * 24 * 90, // 90 days
          secure: true,
          sameSite: "lax"
        }}
        labels={{
          title: "Age Verification Required",
          description: "You must be 21 or older to purchase alcohol.",
          birthdateLabel: "Enter your date of birth"
        }}
        onVerified={(age) => {
          console.log(`Customer is ${age} years old`)
          setAgeVerified(true)
        }}
        onDenied={() => {
          window.location.href = "/non-alcoholic"
        }}
      >
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Legal Notice:</strong> This verification is required by federal law. 
            Your information is not stored and is only used for age verification purposes.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
            <a href="/responsible-drinking" className="text-blue-600 hover:underline">
              Responsible Drinking
            </a>
          </div>
          <p className="text-xs">
            Required by the Alcohol and Tobacco Tax and Trade Bureau (TTB).
          </p>
        </div>
      </AgeGate>
      
      {ageVerified && (
        <div>
          <h1>Wine Collection</h1>
          {/* Wine products */}
        </div>
      )}
    </>
  )
}
```

### Gaming Platform

```tsx
function MatureGameContent() {
  return (
    <AgeGate
      method="simple"
      minimumAge={17}
      rememberVerification={true}
      storageType="sessionStorage" // Reset each session
      labels={{
        title: "Mature Content Warning",
        description: "This game contains mature content suitable for ages 17+",
        simpleConfirm: "I am 17 or older",
        simpleCancel: "Take me back"
      }}
      onVerified={() => {
        // Load mature game content
        loadGameContent()
      }}
      onDenied={() => {
        // Redirect to age-appropriate games
        router.push("/teen-games")
      }}
    />
  )
}
```

### Cannabis/CBD Products

```tsx
function CannabisShop() {
  const [location, setLocation] = useState(null)
  
  return (
    <AgeGate
      method="birthdate"
      minimumAge={21}
      rememberVerification={true}
      storageKey="cannabis-age-verification"
      storageType="cookie"
      cookieOptions={{
        maxAge: 60 * 60 * 24 * 30, // 30 days
        secure: true,
        sameSite: "strict"
      }}
      labels={{
        title: "Age & Location Verification",
        description: "Cannabis products are restricted by age and location.",
        birthdateLabel: "Date of Birth"
      }}
      onVerified={(age) => {
        // Additional location verification might be needed
        verifyLocation()
      }}
    >
      <div className="space-y-4 text-sm">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="font-medium text-yellow-800">Important Legal Notice</p>
          <p className="text-yellow-700 mt-1">
            Cannabis products have not been evaluated by the FDA. These products are not intended 
            to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
        
        <div className="space-y-2">
          <p><strong>By continuing, you confirm:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>You are 21+ years of age</li>
            <li>Cannabis is legal in your jurisdiction</li>
            <li>You will not redistribute these products</li>
            <li>You understand the health risks</li>
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-3 text-xs">
          <a href="/state-laws" className="text-blue-600 hover:underline">
            State Cannabis Laws
          </a>
          <a href="/health-safety" className="text-blue-600 hover:underline">
            Health & Safety Info
          </a>
          <a href="/lab-results" className="text-blue-600 hover:underline">
            Lab Test Results
          </a>
        </div>
        
        <p className="text-xs text-gray-500">
          Regulated by [State Cannabis Control Board]. License #ABC123.
        </p>
      </div>
    </AgeGate>
  )
}
```

## Best Practices

1. **Choose the right method**: Use `simple` for basic gates, `birthdate` when you need exact age
2. **Remember verification**: Enable `rememberVerification` to avoid annoying repeat verifications
3. **Handle denial gracefully**: Always provide alternative content or clear next steps
4. **Customize labels**: Make the language appropriate for your content and audience
5. **Test accessibility**: Ensure the component works with screen readers and keyboard navigation
6. **Consider legal requirements**: Age gates may have legal implications depending on your content and jurisdiction

## Legal Considerations

This component is a UI tool and does not provide legal compliance. Age verification requirements vary by jurisdiction and content type. Consult with legal counsel to ensure your age verification process meets applicable laws and regulations.