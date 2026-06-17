// Lightweight, dependency-free error reporting.
//
// Always emits a structured JSON line to the server log (visible in Vercel
// Functions logs). If ERROR_WEBHOOK_URL is configured, it also fires the same
// payload to that endpoint (Slack/Discord-compatible `text` field + raw fields)
// as a best-effort, non-blocking POST — a failed report never affects the
// request it was reporting on.
//
// This intentionally avoids a heavy APM dependency (e.g. Sentry). To upgrade
// later, swap the webhook POST for the vendor SDK here; call sites stay the same.

type Meta = Record<string, unknown>

export function reportError(event: string, error: unknown, meta?: Meta): void {
  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined

  const entry = {
    ts: new Date().toISOString(),
    level: 'error' as const,
    event,
    message,
    ...meta,
  }

  // 1. Structured log — always.
  console.error(JSON.stringify(entry))

  // 2. Optional webhook — best effort, never throws into the caller.
  const url = process.env.ERROR_WEBHOOK_URL
  if (!url) return

  try {
    void fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 ${event}: ${message}`,
        ...entry,
        stack,
      }),
    }).catch(() => {
      /* swallow — observability must not break the request */
    })
  } catch {
    /* fetch unavailable / sync throw — ignore */
  }
}
