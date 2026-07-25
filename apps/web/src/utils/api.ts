/**
 * Dynamically resolves the API base URL based on the environment.
 * - Server-side builds can use API_BASE_URL (for static generation/pre-rendering).
 * - Client-side requests in the browser can use NEXT_PUBLIC_API_BASE_URL.
 * - Defaults to http://localhost:8080 if neither is set.
 */
export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    // Server-side
    return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  }
  // Client-side
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
}
