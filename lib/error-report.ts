import { getApiUrl } from "./query-client";
import { fetch } from "expo/fetch";

export function reportErrorToBackend(
  error: any,
  source: string = "frontend-crash",
  info?: { componentStack?: string }
) {
  try {
    const errorObject = error instanceof Error ? error : new Error(String(error));
    const baseUrl = getApiUrl();
    const url = new URL("/api/errors/report", baseUrl).toString();
    
    let stack = errorObject.stack || "";
    if (info?.componentStack) {
      stack += "\n\nComponent Stack:" + info.componentStack;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: errorObject.message,
        stack: stack,
        source,
      }),
    }).catch(() => {});
  } catch (err) {
    console.error("Failed to report error:", err);
  }
}
