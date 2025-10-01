import { type NextRequest, NextResponse } from "next/server"
import { track } from "@vercel/analytics/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest, context: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await context.params
    const userAgent = request.headers.get("user-agent") || "unknown"
    const referer = request.headers.get("referer") || "direct"

    // Sanitize component name to prevent path traversal
    const sanitizedName = name.replace(/[^a-zA-Z0-9-]/g, "")
    if (!sanitizedName || sanitizedName !== name) {
      await track("component_request_invalid", {
        requestedName: name,
        userAgent,
      })

      return NextResponse.json({ error: "Invalid component name" }, { status: 400 })
    }

    // Track component request (CONVERSION GOAL)
    await track("component_requested", {
      component: sanitizedName,
      userAgent,
      referer,
      timestamp: new Date().toISOString(),
    })

    // Load component definition
    const componentPath = path.join(process.cwd(), "registry", "r", `${sanitizedName}.json`)

    if (!fs.existsSync(componentPath)) {
      await track("component_not_found", {
        component: sanitizedName,
        userAgent,
      })

      return NextResponse.json({ error: `Component '${sanitizedName}' not found` }, { status: 404 })
    }

    const componentData = JSON.parse(fs.readFileSync(componentPath, "utf-8"))

    // Populate file contents
    const populatedFiles = componentData.files.map((file: any) => {
      const sourcePath = path.join(process.cwd(), file.path)
      let content = ""

      if (fs.existsSync(sourcePath)) {
        content = fs.readFileSync(sourcePath, "utf-8")
      } else {
        console.warn(`Warning: File not found: ${sourcePath}`)
      }

      return { ...file, content }
    })

    const responseData = {
      ...componentData,
      files: populatedFiles,
    }

    // Track successful component delivery (CONVERSION GOAL)
    await track("component_installed", {
      component: sanitizedName,
      fileCount: populatedFiles.length,
      dependencyCount: componentData.dependencies?.length || 0,
      registryDependencyCount: componentData.registryDependencies?.length || 0,
      userAgent,
      referer,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(responseData, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Component error:", error)

    await track("component_error", {
      error: error instanceof Error ? error.message : "unknown",
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
