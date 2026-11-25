"use client";
import { useRef } from "react";
import { gsap, prefersReduced, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { stack } from "@/data/portfolio";
import TechIcon from "./TechIcon";
import { useLang } from "@/lib/lang";

// pick logos that exist, spread around an ellipse
const ICONS = stack.flatMap((g) => g.items).filter((t) => t.icon).filter((t, i, a) => a.findIndex((x) => x.icon === t.icon) === i).slice(0, 18);
const POS = ICONS.map((_, i) => {
  const a = (i / ICONS.length) * Math.PI * 2 + (i % 2 ? 0.2 : -0.1);
  const r = 0.78 + ((i * 37) % 20) / 100; // 0.78–0.97
  return { left: 50 + Math.cos(a) * 44 * r, top: 50 + Math.sin(a) * 40 * r, size: 46 + ((i * 13) % 26) };
});

/** Big "Let's talk" call to action with floating tech icons that scatter away from the cursor. */
export default function LetsTalk() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".lt-icon");
      gsap.from(items, { scale: 0, opacity: 0, stagger: 0.04, duration: 0.8, ease: "back.out(2)", scrollTrigger: { trigger: ref.current, start: "top 70%" } });
      gsap.from(".lt-title .lt-w", { yPercent: 110, stagger: 0.08, duration: 1.1, ease: "power4.out", scrollTrigger: { trigger: ref.current, start: "top 65%" } });
      if (prefersReduced()) return;

      items.forEach((el, i) => {
        gsap.to(el.firstElementChild, { y: "random(-14, 14)", x: "random(-10, 10)", rotate: "random(-12, 12)", duration: 2.5 + (i % 5) * 0.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      });
      const qx = items.map((el) => gsap.quickTo(el, "x", { duration: 0.8, ease: "power3" }));
      const qy = items.map((el) => gsap.quickTo(el, "y", { duration: 0.8, ease: "power3" }));

      const move = (e: PointerEvent) => {
        items.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2 - (Number(gsap.getProperty(el, "x")) || 0);
          const cy = r.top + r.height / 2 - (Number(gsap.getProperty(el, "y")) || 0);
          const dx = cx - e.clientX;
          const dy = cy - e.clientY;
          const d = Math.hypot(dx, dy);
          const force = Math.max(0, 1 - d / 260) * 120; // push away within 260px
          qx[i]((dx / (d || 1)) * force);
          qy[i]((dy / (d || 1)) * force);
        });
      };
      const leave = () => { qx.forEach((f) => f(0)); qy.forEach((f) => f(0)); };
      const sec = ref.current!;
      sec.addEventListener("pointermove", move);
      sec.addEventListener("pointerleave", leave);

      // magnetic button
      const btn = sec.querySelector<HTMLElement>(".lt-btn")!;
      const bx = gsap.quickTo(btn, "x", { duration: 0.6, ease: "power3" });
      const by = gsap.quickTo(btn, "y", { duration: 0.6, ease: "power3" });
      const mag = (e: PointerEvent) => {
        const r = btn.getBoundingClientRect();
        bx((e.clientX - (r.left + r.width / 2)) * 0.35);
        by((e.clientY - (r.top + r.height / 2)) * 0.35);
      };
      const reset = () => { bx(0); by(0); };
      btn.addEventListener("pointermove", mag);
      btn.addEventListener("pointerleave", reset);
      return () => {
        sec.removeEventListener("pointermove", move);
        sec.removeEventListener("pointerleave", leave);
        btn.removeEventListener("pointermove", mag);
        btn.removeEventListener("pointerleave", reset);
      };
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative flex h-[90svh] min-h-[560px] items-center justify-center overflow-hidden bg-bg">
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[120px]" />
      {ICONS.map((t, i) => (
        <div
          key={t.icon}
          className="lt-icon absolute"
          style={{ left: `${POS[i].left}%`, top: `${POS[i].top}%`, marginLeft: -POS[i].size / 2, marginTop: -POS[i].size / 2 }}
        >
          <div
            className="flex items-center justify-center rounded-2xl border border-white/10 bg-card/80 shadow-[0_10px_30px_rgba(0,0,0,.4)] backdrop-blur"
            style={{ width: POS[i].size, height: POS[i].size }}
            title={t.name}
          >
            <TechIcon name={t.name} icon={t.icon} size={POS[i].size * 0.5} />
          </div>
        </div>
      ))}
      <div className="relative z-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted">{t.idea}</p>
        <h2 className="lt-title mt-4 font-heavy text-[15vw] uppercase leading-[0.95] md:text-[9vw]">
          <span className="inline-block overflow-hidden align-bottom"><span className="lt-w inline-block text-brand">{t.talkNow}</span></span>
        </h2>
        <p className="mt-4 font-display text-2xl text-fg/80 md:text-4xl">{t.talkSub}</p>
        <button
          onClick={() => scrollToTarget("#contact")}
          className="lt-btn btn-glow mt-10 rounded-full px-12 py-5 text-sm font-extrabold uppercase tracking-[0.25em]"
        >
          {t.startProject} →
        </button>
      </div>
    </section>
  );
}
