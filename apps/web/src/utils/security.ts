/**
 * Safely escapes HTML special characters to prevent HTML/XSS injection.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitizes telemetry values by redacting sensitive data like emails, passwords, keys, etc.
 * to prevent personal identifier or credential leaks in tracking event parameters.
 */
export function sanitizeTelemetryValue(val: string): string {
  if (!val) return "";
  
  // 1. Redact email addresses (matches username + domain)
  let sanitized = val.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[email_redacted]");
  
  // 2. Redact key-value secrets (e.g. password=..., secret: ..., token = ...)
  sanitized = sanitized.replace(/(password|passwd|pass|pwd|secret|token|key|credential|auth)\s*[:=]\s*[^\s]+/gi, "$1=[redacted]");
  
  return sanitized;
}
