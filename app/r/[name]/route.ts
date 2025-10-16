import { type NextRequest } from "next/server"

/**
 * Short URL proxy for component registry
 * Proxies /r/[name] to /api/registry/r/[name]
 *
 * This allows users to install components with cleaner URLs:
 * npx shadcn@latest add https://feature-lock.griffen.codes/r/blur-wrapper
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params

  // Build the full API URL
  const url = new URL(request.url)
  url.pathname = `/api/registry/r/${name}`

  // Proxy to the API endpoint
  const response = await fetch(url.toString(), {
    headers: {
      "user-agent": request.headers.get("user-agent") || "unknown",
      referer: request.headers.get("referer") || "direct",
    },
  })

  return response
}
