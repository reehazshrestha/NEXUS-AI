// Streaming chat proxy (SSE passthrough) to the OpenAI-compatible Gemini web2api gateway.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const UPSTREAM = process.env.UPSTREAM || "https://gemini-web2api-one.vercel.app";

const jsonError = (message: string, status: number) =>
  Response.json({ error: { message } }, { status });

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    };
    const userKey = req.headers.get("x-api-key");
    if (userKey) headers.Authorization = `Bearer ${userKey}`;

    const upstream = await fetch(`${UPSTREAM}/v1/chat/completions`, {
      method: "POST",
      headers,
      body,
      signal: req.signal,
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") || "text/event-stream",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (e) {
    return jsonError(`Upstream error: ${(e as Error).message}`, 502);
  }
}
