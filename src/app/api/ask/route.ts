import Anthropic from "@anthropic-ai/sdk";
import { localAnswer, systemPrompt } from "@/lib/assistant";

type Msg = { role: "user" | "assistant"; content: string };

const MAX_LEN = 600; // characters per message
const MAX_TURNS = 8; // messages of history sent to the model
const LIMIT = 12; // requests per IP per window
const WINDOW = 10 * 60 * 1000;
const hits = new Map<string, { n: number; t: number }>();

function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > WINDOW) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n += 1;
  return h.n > LIMIT;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ answer: "Too many questions for now, please try again in a few minutes.", source: "limit" }, { status: 429 });

  let body: { messages?: Msg[]; lang?: "en" | "ar" };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const lang = body.lang === "ar" ? "ar" : "en";
  const messages = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_LEN) }))
    .slice(-MAX_TURNS);
  // the conversation must start with the visitor
  while (messages.length && messages[0].role !== "user") messages.shift();
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user") return Response.json({ error: "Ask a question" }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ answer: localAnswer(last.content, lang), source: "local" });
  }

  try {
    const client = new Anthropic();
    const res = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 600,
      system: systemPrompt(),
      output_config: { effort: "low" },
      messages,
    });
    if (res.stop_reason === "refusal") return Response.json({ answer: localAnswer(last.content, lang), source: "local" });
    const answer = res.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("").trim();
    return Response.json({ answer: answer || localAnswer(last.content, lang), source: "ai" });
  } catch (err) {
    console.error("ask route:", err instanceof Anthropic.APIError ? `${err.status} ${err.message}` : err);
    return Response.json({ answer: localAnswer(last.content, lang), source: "local" });
  }
}
