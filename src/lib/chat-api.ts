export interface ModelInfo {
  id: string;
  description: string;
}

export const DEFAULT_MODELS: ModelInfo[] = [
  { id: "gemini-3.5-flash", description: "All-around model" },
  { id: "gemini-3.5-flash-thinking", description: "Deep thinking mode" },
  { id: "gemini-3.7-flash", description: "Latest all-around model" },
  { id: "gemini-3.1-pro", description: "Pro model" },
  { id: "gemini-flash-lite", description: "Lightweight fast model" },
  { id: "gemini-auto", description: "Auto model selection" },
];

const SYSTEM_PROMPT =
  'You are NexusAI, a helpful, friendly AI assistant. Format answers with clean Markdown. Be concise but complete. When it makes sense, end your reply with 1–3 suggestions for what the user might ask next, each on its own line at the very end, in exactly this format: <FollowUp label="short chip text" query="full message to send"/> — nothing after them.';

export const isThinkingModel = (id: string) => id.includes("thinking");

export async function fetchModels(): Promise<ModelInfo[]> {
  try {
    const res = await fetch("/api/models");
    const j = await res.json();
    const list = (j.data || []).map((m: ModelInfo) => ({
      id: m.id,
      description: m.description || "",
    }));
    return list.length ? list : DEFAULT_MODELS;
  } catch {
    return DEFAULT_MODELS;
  }
}

// Map (selected model, thinking toggle) to a model id that exists.
export function resolveModel(
  base: string,
  thinking: boolean,
  models: ModelInfo[],
) {
  const ids = models.map((m) => m.id);
  if (!base.startsWith("gemini")) return base;
  if (thinking && !isThinkingModel(base)) {
    const candidate = base + "-thinking";
    return ids.includes(candidate) ? candidate : base;
  }
  if (!thinking && isThinkingModel(base)) {
    const stripped = base
      .replace("-thinking-lite", "")
      .replace("-thinking", "");
    return ids.includes(stripped) ? stripped : base;
  }
  return base;
}

async function errorFrom(res: Response) {
  let msg = "HTTP " + res.status;
  try {
    const j = await res.json();
    if (j.error?.message) msg = j.error.message;
  } catch {}
  return new Error(msg);
}

export async function streamChat(opts: {
  model: string;
  history: { role: string; content: string }[];
  signal: AbortSignal;
  onContent: (chunk: string) => void;
  onReasoning: (chunk: string) => void;
}) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: opts.model,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...opts.history],
    }),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) throw await errorFrom(res);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const events = buf.split("\n\n");
    buf = events.pop() ?? "";
    for (const ev of events) {
      for (const line of ev.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") continue;
        let json;
        try {
          json = JSON.parse(data);
        } catch {
          continue;
        }
        const delta = json.choices?.[0]?.delta ?? {};
        if (delta.reasoning_content) opts.onReasoning(delta.reasoning_content);
        if (delta.content) opts.onContent(delta.content);
      }
    }
  }
}

export async function generateTitle(
  text: string,
  model: string,
): Promise<string | null> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        max_tokens: 24,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You craft concise chat titles. Reply with ONLY the title: 2–6 words, lowercase, no quotes, no trailing punctuation, no numbering.",
          },
          { role: "user", content: text.slice(0, 500) },
        ],
      }),
    });
    if (!res.ok) return null;
    const j = await res.json();
    const t = String(j.choices?.[0]?.message?.content || "")
      .trim()
      .replace(/^["“”]+|["“”.]+$/g, "")
      .slice(0, 48);
    if (!t || t.length > 40 || /https?:\/\//i.test(t)) return null;
    return t;
  } catch {
    return null;
  }
}

const FOLLOWUP_RE = /<FollowUp\s+label="([^"]*)"\s+query="([^"]*)"\s*\/>/g;

export function splitFollowUps(text: string) {
  const followUps = [...text.matchAll(FOLLOWUP_RE)].map((m) => ({
    label: m[1],
    query: m[2],
  }));
  return { content: text.replace(FOLLOWUP_RE, "").trimEnd(), followUps };
}

// Hide complete tags and any partial tag at the tail while streaming.
export function stripForStreaming(text: string) {
  return text
    .replace(FOLLOWUP_RE, "")
    .replace(/<FollowUp[^>]*$/, "")
    .trimEnd();
}
