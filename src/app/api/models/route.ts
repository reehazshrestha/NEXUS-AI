// Model list passthrough.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPSTREAM = process.env.UPSTREAM || "https://gemini-web2api-one.vercel.app";

export async function GET() {
  try {
    const upstream = await fetch(`${UPSTREAM}/v1/models`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    return Response.json(
      { error: { message: `Upstream error: ${(e as Error).message}` } },
      { status: 502 },
    );
  }
}
