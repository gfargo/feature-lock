import { NextResponse } from "next/server"
import { track } from "@vercel/analytics/server"
import fs from "fs"
import path from "path"

export async function GET(request: Request) {
  try {
    // Track registry manifest requests
    const url = new URL(request.url)
    const userAgent = request.headers.get("user-agent") || "unknown"

    await track("registry_manifest_requested", {
      userAgent,
      timestamp: new Date().toISOString(),
    })

    const registryPath = path.join(process.cwd(), "registry", "registry.json")

    if (!fs.existsSync(registryPath)) {
      await track("registry_manifest_error", {
        error: "not_found",
        userAgent,
      })

      return NextResponse.json(
        { error: "Registry not found. Run npm run gen:registry to generate it." },
        { status: 404 },
      )
    }

    const registryContent = fs.readFileSync(registryPath, "utf-8")
    const registry = JSON.parse(registryContent)

    await track("registry_manifest_served", {
      componentCount: registry.registry?.length || 0,
      userAgent,
    })

    return NextResponse.json(registry, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Registry error:", error)

    await track("registry_manifest_error", {
      error: error instanceof Error ? error.message : "unknown",
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
