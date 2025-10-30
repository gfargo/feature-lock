"use client"

import * as React from "react"
import Link from "next/link"
import { track } from "@vercel/analytics"
import AgeGate from "@/components/ageGate/age-gate"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function AgeGateSection() {
  const [ageGateOpen, setAgeGateOpen] = React.useState(false)
  const [hasTriggered, setHasTriggered] = React.useState(false)
  const [userAge, setUserAge] = React.useState<number | null>(null)
  const [verificationMethod, setVerificationMethod] = React.useState<"simple" | "birthdate">("simple")
  const sectionRef = React.useRef<HTMLElement>(null)

  // Scroll trigger effect
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            // Delay slightly to let the section come into view
            setTimeout(() => {
              setAgeGateOpen(true)
              setHasTriggered(true)
              track("home_age_gate_auto_triggered")
            }, 500)
          }
        })
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: "0px 0px -100px 0px" // Trigger a bit before fully in view
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasTriggered])

  const handleVerified = async (age?: number) => {
    track("home_age_gate_verified", { 
      age: age || "unknown", 
      method: verificationMethod 
    })
    
    setUserAge(age || null)
    await wait(500) // Brief delay for UX
  }

  const handleDenied = async () => {
    track("home_age_gate_denied", { method: verificationMethod })
    await wait(500)
  }

  const handleMethodChange = (method: "simple" | "birthdate") => {
    setVerificationMethod(method)
    track("home_age_gate_method_changed", { method })
  }

  const resetDemo = () => {
    setAgeGateOpen(false)
    setUserAge(null)
    setHasTriggered(false)
    track("home_age_gate_demo_reset")
    
    // Re-trigger after a short delay
    setTimeout(() => {
      setAgeGateOpen(true)
      setHasTriggered(true)
    }, 300)
  }

  return (
    <section 
      ref={sectionRef}
      className="space-y-6 rounded-2xl border border-primary/10 bg-card/50 p-8 backdrop-blur-sm"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AgeGate · Verify age without disrupting flow
            </h2>
            <Badge variant="secondary" className="text-xs">
              Auto-triggered
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Contextual age verification for alcohol, cannabis, adult content, and regulated products.
            Supports multiple storage methods and custom compliance content.
          </p>
        </div>
        <Link href="/docs#age-gate">
          <Button
            variant="ghost"
            size="sm"
            className="self-start md:self-auto"
            onClick={() => track("home_age_gate_docs_clicked")}
          >
            View docs
          </Button>
        </Link>
      </div>

      {/* Demo Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Demo method:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={verificationMethod === "simple" ? "default" : "outline"}
              onClick={() => handleMethodChange("simple")}
              disabled={ageGateOpen}
            >
              Simple
            </Button>
            <Button
              size="sm"
              variant={verificationMethod === "birthdate" ? "default" : "outline"}
              onClick={() => handleMethodChange("birthdate")}
              disabled={ageGateOpen}
            >
              Birthdate
            </Button>
          </div>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={resetDemo}
          className="ml-auto"
        >
          Reset Demo
        </Button>
      </div>

      {/* Status Display */}
      {userAge !== null && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">
              Age verified: {userAge} years old
            </span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            User can now access age-restricted content
          </p>
        </div>
      )}

      {/* Age Gate Component */}
      <AgeGate
        open={ageGateOpen}
        onOpenChange={setAgeGateOpen}
        method={verificationMethod}
        minimumAge={21}
        rememberVerification={false} // Don't remember for demo
        labels={{
          title: "Age Verification Demo",
          description: "This is a demonstration of the AgeGate component.",
          simpleConfirm: "I am 21 or older",
          simpleCancel: "I am under 21",
          birthdateLabel: "Enter your date of birth"
        }}
        onVerified={handleVerified}
        onDenied={handleDenied}
        onError={(error) => {
          console.error("Age gate error:", error)
          track("home_age_gate_error", { error: String(error) })
        }}
      >
        <div className="space-y-3 text-sm text-gray-600">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="font-medium text-blue-800">Demo Notice</p>
            <p className="text-blue-700 mt-1">
              This is a demonstration of the AgeGate component. In a real application, 
              this would be used to verify age for alcohol, cannabis, or other age-restricted products.
            </p>
          </div>
          
          <div className="space-y-2">
            <p><strong>Features demonstrated:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Scroll-triggered activation</li>
              <li>Multiple verification methods</li>
              <li>Custom content and disclaimers</li>
              <li>Async verification handling</li>
              <li>Accessible design patterns</li>
            </ul>
          </div>
          
          <div className="flex flex-wrap gap-3 text-xs">
            <a 
              href="https://feature-lock.griffen.codes/r/age-gate" 
              className="text-blue-600 hover:underline"
              onClick={() => track("home_age_gate_install_clicked")}
            >
              Install Component
            </a>
            <a 
              href="/docs#age-gate" 
              className="text-blue-600 hover:underline"
              onClick={() => track("home_age_gate_docs_clicked")}
            >
              View Documentation
            </a>
            <a 
              href="https://github.com/feature-lock/examples" 
              className="text-blue-600 hover:underline"
              onClick={() => track("home_age_gate_examples_clicked")}
            >
              See Examples
            </a>
          </div>
          
          <p className="text-xs text-gray-500">
            Perfect for e-commerce, gaming, adult content, and regulated industries.
          </p>
        </div>
      </AgeGate>

      {/* Installation Command */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Installation</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText("npx shadcn@latest add https://feature-lock.griffen.codes/r/age-gate")
              track("home_age_gate_install_copied")
            }}
          >
            Copy
          </Button>
        </div>
        <code className="text-xs text-muted-foreground font-mono">
          npx shadcn@latest add https://feature-lock.griffen.codes/r/age-gate
        </code>
      </div>
    </section>
  )
}