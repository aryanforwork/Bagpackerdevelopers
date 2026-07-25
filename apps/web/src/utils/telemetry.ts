import { sanitizeTelemetryValue } from "./security";

/**
 * Tracks custom telemetry events via GA4 (gtag) after automatically
 * sanitizing all event parameters to prevent leaking sensitive details.
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === "undefined") return;
  
  const gtag = (window as any).gtag;
  if (typeof gtag !== "function") {
    console.warn(`gtag not initialized. Event "${eventName}" was skipped.`, params);
    return;
  }

  const sanitizedParams: Record<string, any> = {};
  if (params) {
    for (const [key, val] of Object.entries(params)) {
      if (typeof val === "string") {
        sanitizedParams[key] = sanitizeTelemetryValue(val);
      } else if (typeof val === "object" && val !== null) {
        try {
          const stringified = JSON.stringify(val);
          const sanitizedString = sanitizeTelemetryValue(stringified);
          sanitizedParams[key] = JSON.parse(sanitizedString);
        } catch (_) {
          sanitizedParams[key] = val;
        }
      } else {
        sanitizedParams[key] = val;
      }
    }
  }

  gtag("event", eventName, sanitizedParams);
}
