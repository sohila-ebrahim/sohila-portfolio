"use client";
import { useRef, useState } from "react";
import { gsap, prefersReduced, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { profile } from "@/data/portfolio";
import SplitText from "./SplitText";
import TechIcon from "./TechIcon";
import { useLang } from "@/lib/lang";
import { scrollToTarget } from "@/lib/scroll";

/** FormSubmit target: her address for now; replace with the alias FormSubmit emails after activation. */
const FORMSUBMIT_TARGET = "sohilaebrahim6789@gmail.com";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err" | "rate">("idle");
  const { t } = useLang();

  useGSAP(
    () => {
      gsap.from(".ct-title .char", { yPercent: 120, stagger: 0.02, duration: 1, ease: "power4.out", scrollTrigger: { trigger: ".ct-title", start: "top 80%" } });
      gsap.from(".ct-fade", { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".ct-title", start: "top 70%" } });
    },
    { scope: ref }
  );

  // sends the form straight from the browser to FormSubmit, which emails it to Sohila.
  // After she activates the form, FORMSUBMIT_TARGET can be swapped for the random alias FormSubmit sends her.
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const name = String(f.get("name") ?? "").trim().slice(0, 100);
    const email = String(f.get("email") ?? "").trim().slice(0, 150);
    const message = String(f.get("message") ?? "").trim().slice(0, 3000);
    if (!name || !email || !message) return setStatus("err");
    // simple client-side flood guard: one message every 30 seconds
    const last = Number(sessionStorage.getItem("ct-last") || 0);
    if (Date.now() - last < 30_000) return setStatus("rate");
    setStatus("sending");
    const fallback = () => {
      // email service unavailable: open the visitor's own email app so the message isn't lost
      const subject = `New message from your portfolio - ${name}`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${message}\n\n— ${name} (${email})`)}`;
      setStatus("err");
    };
    try {
      // give up after 20 s so the button never hangs on "Sending…"
      const r = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_TARGET}`, {
        method: "POST",
        signal: AbortSignal.timeout(20000),
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `New message from your portfolio - ${name}`,
          _template: "table",
          _captcha: "false",
          _replyto: email,
          _honey: String(f.get("_honey") ?? ""),
        }),
      });
      if (!r.ok) return fallback();
      sessionStorage.setItem("ct-last", String(Date.now()));
      setStatus("ok");
      form.reset();
    } catch {
      fallback();
    }
  };

  const items = [
    { label: t.emailMe, value: profile.email, href: `mailto:${profile.email}`, icon: "siGmail" },
    { label: t.nav.whatsapp, value: profile.phone, href: profile.whatsapp, icon: "siWhatsapp" },
    { label: t.phone, value: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}`, icon: "", kind: "phone" },
    { label: t.location, value: profile.location, href: "", icon: "", kind: "loc" },
  ];

  return (
    <section id="contact" ref={ref} className="px-site w-full bg-[#0b0a13] py-20 md:py-28">
      <p className="ct-fade flex items-center gap-3 font-display text-2xl font-bold uppercase md:text-[42px]">
        <span className="text-accent">✸</span> {t.getInTouch} <span className="text-accent">{t.getInTouchAccent}</span>
      </p>

      <div className="mt-16 grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        <div>
          <h2 className="ct-title font-display text-[13vw] font-bold uppercase leading-[1.05] tracking-tight md:text-[7.5vw] lg:text-[100px]">
            <SplitText text={t.contactTitle[0]} />
            <br />
            <SplitText text={t.contactTitle[1]} className="text-accent" />
            <br />
            <SplitText text={t.contactTitle[2]} className="text-accent" />
          </h2>
          <p className="ct-fade mt-8 max-w-md text-muted">{t.contactIntro}</p>
          <ul className="mt-10 space-y-6">
            {items.map((it) => {
              const inner = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface">
                    {it.icon ? <TechIcon name={it.label} icon={it.icon} size={18} /> : <span className="text-accent">{"kind" in it && it.kind === "phone" ? "☎" : "⌖"}</span>}
                  </span>
                  <span>
                    <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-accent-soft">{it.label}</span>
                    <span className="block font-semibold" dir="ltr">{it.value}</span>
                  </span>
                </>
              );
              return (
                <li key={it.label} className="ct-fade">
                  {it.href ? (
                    <a href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-4 transition hover:text-accent-soft">
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <a
            href={profile.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="ct-fade mt-10 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-7 py-4 text-sm font-bold text-[#062b14] transition hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(37,211,102,.35)]"
          >
            <TechIcon name="WhatsApp" icon="siWhatsapp" size={20} mono /> {t.chatWhatsapp}
          </a>
        </div>

        <form onSubmit={submit} className="ct-fade relative h-fit rounded-3xl border border-accent/30 bg-surface/80 p-6 shadow-[0_0_60px_rgba(139,92,246,.12)] md:p-10">
          <h3 className="font-display text-2xl font-bold">{t.formTitle}</h3>
          <p className="mt-2 text-sm text-muted">{t.formIntro}</p>
          <label className="mt-8 block text-[11px] font-bold uppercase tracking-[0.2em] text-muted" htmlFor="ct-name">{t.formName}</label>
          <input id="ct-name" name="name" required maxLength={100} autoComplete="name" placeholder="Jane Doe" className="mt-3 w-full rounded-xl border border-line bg-bg/70 px-4 py-3 outline-none transition placeholder:text-muted/60 focus:border-accent" />
          <label className="mt-6 block text-[11px] font-bold uppercase tracking-[0.2em] text-muted" htmlFor="ct-from">{t.formEmail}</label>
          <input id="ct-from" name="email" type="email" required maxLength={150} autoComplete="email" dir="ltr" placeholder="name@example.com" className="mt-3 w-full rounded-xl border border-line bg-bg/70 px-4 py-3 outline-none transition placeholder:text-muted/60 focus:border-accent" />
          <label className="mt-6 block text-[11px] font-bold uppercase tracking-[0.2em] text-muted" htmlFor="ct-msg">{t.formMsg}</label>
          <textarea id="ct-msg" name="message" required maxLength={3000} rows={5} placeholder="Tell me about your project…" className="mt-3 w-full resize-none rounded-xl border border-line bg-bg/70 px-4 py-3 outline-none transition placeholder:text-muted/60 focus:border-accent" />
          {/* honeypot for bots, hidden from people */}
          <input name="_honey" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          <button type="submit" disabled={status === "sending"} className="btn-glow mt-8 w-full rounded-full py-4 text-xs font-extrabold uppercase tracking-[0.25em] disabled:opacity-60">
            {status === "sending" ? t.formSending : t.formSend}
          </button>
          <p className={`mt-4 min-h-[1.25rem] text-center text-sm ${status === "ok" ? "text-emerald-400" : "text-rose-400"}`} role="status" aria-live="polite">
            {status === "ok" ? t.formOk : status === "err" ? t.formErr : status === "rate" ? t.formRate : ""}
          </p>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      gsap.from(".ft-title .char", { yPercent: 120, stagger: 0.03, duration: 1, ease: "power4.out", scrollTrigger: { trigger: ref.current, start: "top 70%" } });
      if (prefersReduced()) return;
      const loop = gsap.to(".ft-marquee", { xPercent: -50, duration: 40, ease: "none", repeat: -1 });
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          gsap.to(loop, { timeScale: gsap.utils.clamp(-6, 6, self.getVelocity() / 300) || 1, duration: 0.3, overwrite: true });
          gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.3 });
        },
      });
    },
    { scope: ref }
  );
  const name = `${profile.firstName} ${profile.lastName} · `;
  const { t } = useLang();
  return (
    <footer ref={ref} className="relative flex w-full flex-col overflow-hidden border-t border-white/5 bg-surface pb-12 pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-10 select-none overflow-hidden">
        <div className="ft-marquee flex w-max whitespace-nowrap font-heavy text-[20vw] uppercase leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(167,139,250,0.22)]">
          <span>{name.repeat(3)}</span>
          <span>{name.repeat(3)}</span>
        </div>
      </div>
      <div className="px-site relative grid gap-12 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <h2 className="ft-title font-display text-[14vw] font-bold uppercase leading-[0.95] md:text-[8vw]">
            <SplitText text={t.closing[0]} />
            <br />
            <SplitText text={t.closing[1]} className="text-accent" />
          </h2>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget("#contact"); setTimeout(() => document.getElementById("ct-name")?.focus({ preventScroll: true }), 1200); }} className="btn-glow mt-10 inline-block rounded-full px-10 py-4 text-xs font-extrabold uppercase tracking-[0.25em]">
            {t.sendMessage}
          </a>
        </div>
        <div className="space-y-8 md:text-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-soft">Socials</p>
            <div className="mt-3 flex gap-3 md:justify-end">
              {profile.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition hover:border-accent">
                  <TechIcon name={s.label} icon={{ GitHub: "siGithub", WhatsApp: "siWhatsapp", Email: "siGmail" }[s.label]} size={18} mono />
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-soft">{t.nav.contact}</p>
            <a href={`mailto:${profile.email}`} className="mt-2 block font-semibold link-underline">{profile.email}</a>
            <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="mt-1 block text-muted hover:text-fg">{profile.phone}</a>
          </div>
        </div>
      </div>
      <p className="px-site relative mt-20 text-sm text-muted">© {profile.year} Sohila Ebrahim. {t.rights}</p>
    </footer>
  );
}
