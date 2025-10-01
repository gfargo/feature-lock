import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest, context: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await context.params

    // Sanitize component name to prevent path traversal
    const sanitizedName = name.replace(/[^a-zA-Z0-9-]/g, "")
    if (!sanitizedName || sanitizedName !== name) {
      return NextResponse.json({ error: "Invalid component name" }, { status: 400 })
    }

    // Load component definition
    const componentPath = path.join(process.cwd(), "registry", "r", `${sanitizedName}.json`)

    if (!fs.existsSync(componentPath)) {
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

    return NextResponse.json(
      {
        ...componentData,
        files: populatedFiles,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    )
  } catch (error) {
    console.error("Component error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
