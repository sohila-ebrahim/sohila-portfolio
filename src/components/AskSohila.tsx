"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/lib/lang";

type Msg = { role: "user" | "assistant"; content: string };

/** "Ask Sohila" floating pill (bottom-left) that opens a small chat about her work. */
export default function AskSohila() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  const send = async (text: string) => {
    const q = text.trim().slice(0, 600);
    if (!q || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/ask", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: next, lang }) });
      const d = await r.json();
      setMsgs([...next, { role: "assistant", content: d.answer || t.askError }]);
    } catch {
      setMsgs([...next, { role: "assistant", content: t.askError }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-floating className="fixed bottom-5 start-4 z-40 md:bottom-8 md:start-8" data-lenis-prevent>
      {open && (
        <div className="absolute bottom-[72px] start-0 flex h-[min(520px,70svh)] w-[min(370px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-accent/30 bg-[#110e1b]/95 shadow-[0_30px_80px_rgba(0,0,0,.6),0_0_40px_rgba(139,92,246,.2)] backdrop-blur-xl" role="dialog" aria-label={t.ask}>
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-accent/60">
              <Image src="/avatar/sohila.webp" alt="" fill sizes="36px" className="object-cover" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold">{t.ask}</p>
              <p className="flex items-center gap-1.5 text-[11px] text-muted"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {t.askSub}</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label={t.close} className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-white/10 hover:text-fg">✕</button>
          </div>
          <div ref={list} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
            <p className="max-w-[85%] rounded-2xl rounded-ss-sm bg-white/[0.06] px-3.5 py-2.5 leading-relaxed">{t.askHello}</p>
            {msgs.map((m, i) => (
              <p
                key={i}
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 leading-relaxed [overflow-wrap:anywhere] ${m.role === "user" ? "ms-auto rounded-se-sm bg-accent text-white" : "rounded-ss-sm bg-white/[0.06]"}`}
              >
                {m.content}
              </p>
            ))}
            {busy && <p className="w-14 rounded-2xl bg-white/[0.06] px-3.5 py-2.5 tracking-widest text-muted">•••</p>}
            {msgs.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {t.askChips.map((c) => (
                  <button key={c} onClick={() => send(c)} className="rounded-full border border-accent/40 px-3 py-1.5 text-xs text-accent-soft transition hover:bg-accent hover:text-white">
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              placeholder={t.askPlaceholder}
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-bg/70 px-4 py-2.5 text-sm outline-none placeholder:text-muted/70 focus:border-accent"
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white transition disabled:opacity-40">
              <span className="rtl:-scale-x-100">➤</span>
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-3 rounded-full border border-accent/50 bg-[#141020]/90 py-1.5 pe-1.5 ps-1.5 shadow-[0_0_30px_rgba(139,92,246,.35)] backdrop-blur-xl transition hover:border-accent"
      >
        <span className="relative h-10 w-10 shrink-0">
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <Image src="/avatar/sohila.webp" alt="" fill sizes="40px" className="object-cover" />
          </span>
          <span className="absolute -bottom-0.5 -end-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#141020] bg-emerald-400" />
        </span>
        <span className="hidden text-start sm:block">
          <span className="block text-sm font-bold leading-tight">{t.ask}</span>
          <span className="block text-[11px] leading-tight text-accent-soft">✦ {t.askSub}</span>
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white">✦</span>
      </button>
    </div>
  );
}
