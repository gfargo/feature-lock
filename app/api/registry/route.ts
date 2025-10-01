import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const registryPath = path.join(process.cwd(), "registry", "registry.json")

    if (!fs.existsSync(registryPath)) {
      return NextResponse.json(
        { error: "Registry not found. Run npm run gen:registry to generate it." },
        { status: 404 },
      )
    }

    const registryContent = fs.readFileSync(registryPath, "utf-8")
    const registry = JSON.parse(registryContent)

    return NextResponse.json(registry, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("Registry error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
