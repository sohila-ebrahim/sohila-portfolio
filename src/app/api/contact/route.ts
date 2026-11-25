// Contact form -> email to Sohila through FormSubmit (no account, no key).
// The recipient stays on the server (CONTACT_EMAIL), never in client JS.
const TO = process.env.CONTACT_EMAIL || "sohilaebrahim6789@gmail.com";

const LIMIT = 5; // messages per IP per window
const WINDOW = 15 * 60 * 1000;
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

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  // honeypot: real people never fill this hidden field
  if (typeof body.company === "string" && body.company.trim()) return Response.json({ ok: true });

  const name = String(body.name ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().slice(0, 150);
  const message = String(body.message ?? "").trim().slice(0, 3000);
  if (!name || !email || !message) return Response.json({ ok: false, error: "missing" }, { status: 400 });
  if (!EMAIL.test(email)) return Response.json({ ok: false, error: "email" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) return Response.json({ ok: false, error: "rate" }, { status: 429 });

  try {
    const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TO)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: `New message from your portfolio - ${name}`,
        _template: "table",
        _captcha: "false",
        _replyto: email,
      }),
    });
    const data = (await r.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
    const ok = r.ok && String(data.success) === "true";
    if (!ok) console.error("contact: formsubmit", r.status, data.message);
    // FormSubmit answers "needs activation" until the first email is confirmed; the message is still queued for her
    return Response.json({ ok: r.ok, info: data.message ?? null }, { status: r.ok ? 200 : 502 });
  } catch (err) {
    console.error("contact:", err);
    return Response.json({ ok: false, error: "send" }, { status: 502 });
  }
}
