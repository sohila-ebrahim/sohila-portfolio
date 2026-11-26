"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, prefersReduced } from "@/lib/gsap";
import { profile } from "@/data/portfolio";

type Props = {
  /** card width in px (text scales with it) */
  width?: number;
  /** lanyard length in px */
  rope?: number;
  /** container height (CSS) */
  height?: string;
  /** keep swinging gently like a pendulum when nobody touches it */
  swing?: boolean;
  /** animated glowing outline around the card */
  glow?: boolean;
  className?: string;
};

/**
 * Developer ID badge hanging on a lanyard. Verlet pendulum: it swings, can be grabbed
 * and thrown, then settles back. With `swing` a soft driving force keeps it rocking ±7°.
 */
export default function IdBadge({ width = 250, rope = 230, height = "560px", swing = false, glow = false, className = "" }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const strap = useRef<SVGPathElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [qr, setQr] = useState("");
  const flip = useRef(() => setFlipped((v) => !v));

  // QR code for the back of the card (light: generated once on the client)
  useEffect(() => {
    import("qrcode").then((Q) => Q.toDataURL("https://sohila-portfolio-ten.vercel.app", { margin: 1, width: 300, color: { dark: "#140f22", light: "#ffffff" } })).then(setQr).catch(() => {});
  }, []);

  useEffect(() => {
    const el = box.current!;
    const reduce = prefersReduced();
    let raf = 0;
    let visible = false;
    let anchorX = el.clientWidth / 2;
    let p = { x: anchorX + (reduce ? 0 : rope * 0.35), y: reduce ? rope : rope * 0.94 };
    let pp = { ...p };
    let drag: { id: number; dx: number; dy: number } | null = null;
    let target = { ...p };
    const t0 = performance.now();

    const draw = () => {
      if (!card.current || !strap.current) return;
      const angle = Math.atan2(p.x - anchorX, p.y);
      card.current!.style.transform = `translate(${p.x - width / 2}px, ${p.y}px) rotate(${(-angle * 180) / Math.PI}deg)`;
      const midX = (anchorX + p.x) / 2;
      const w = Math.max(10, width * 0.06);
      strap.current!.setAttribute("d", `M${anchorX - w} 0 Q${midX} ${p.y / 2} ${p.x - 6} ${p.y + 4} M${anchorX + w} 0 Q${midX} ${p.y / 2} ${p.x + 6} ${p.y + 4}`);
    };

    const step = (now: number): void => {
    if (!visible && !drag) { raf = requestAnimationFrame(tick); return; }
      if (drag) {
        pp = { ...p };
        p = { x: p.x + (target.x - p.x) * 0.5, y: p.y + (target.y - p.y) * 0.5 };
      } else {
        const vx = (p.x - pp.x) * 0.985;
        const vy = (p.y - pp.y) * 0.985;
        pp = { ...p };
        // gentle pendulum drive: pull toward a target angle that moves like a sine (±7°)
        let fx = 0;
        if (swing) {
          const a = Math.sin(((now - t0) / 1000) * 1.6) * (7 * Math.PI) / 180;
          fx = (anchorX + Math.sin(a) * rope - p.x) * 0.004;
        }
        p = { x: p.x + vx + fx, y: p.y + vy + 0.9 };
      }
      const dx = p.x - anchorX;
      const d = Math.hypot(dx, p.y) || 1;
      if (d > rope || !drag) p = { x: anchorX + (dx / d) * rope, y: (p.y / d) * rope };
      draw();
      raf = requestAnimationFrame(step);
    };
    const tick = (now: number) => (visible || drag ? step(now) : (raf = requestAnimationFrame(tick)));

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(el);
    visible = true;
    if (!reduce) raf = requestAnimationFrame(step);

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    let tap: { x: number; y: number; t: number } | null = null;
    const down = (e: PointerEvent) => {
      tap = { x: e.clientX, y: e.clientY, t: performance.now() };
      // touch: no dragging, so the page keeps scrolling; a tap flips the card
      if (reduce || e.pointerType === "touch") return;
      const l = local(e);
      drag = { id: e.pointerId, dx: l.x - p.x, dy: l.y - p.y };
      target = { ...p };
      card.current!.setPointerCapture(e.pointerId);
      card.current!.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const l = local(e);
      target = { x: l.x - drag.dx, y: l.y - drag.dy };
    };
    const up = (e: PointerEvent) => {
      if (tap && Math.hypot(e.clientX - tap.x, e.clientY - tap.y) < 8 && performance.now() - tap.t < 400) flip.current();
      tap = null;
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      card.current!.style.cursor = "grab";
    };
    const resize = () => {
      const old = anchorX;
      anchorX = el.clientWidth / 2;
      p.x += anchorX - old;
      pp.x += anchorX - old;
      draw();
    };

    const c = card.current!;
    c.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("resize", resize);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      c.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("resize", resize);
    };
  }, [rope, width, swing]);

  const fs = (width / 250) * 16; // base font size: the card's text scales with its width

  return (
    <div ref={box} className={`relative w-full touch-pan-y select-none ${className}`} style={{ height }}>
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="strap-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#6d28d9" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
        <path ref={strap} fill="none" stroke="url(#strap-grad)" strokeWidth={Math.max(8, width * 0.04)} strokeLinecap="round" opacity="0.95" />
      </svg>
      <div
        ref={card}
        data-cursor
        style={{ width, transformOrigin: `${width / 2}px 0px`, cursor: "grab", touchAction: "pan-y", fontSize: fs, perspective: 900 }}
        className="absolute left-0 top-0 will-change-transform"
        aria-label={`ID badge: ${profile.firstName} ${profile.lastName}, ${profile.role}`}
        dir="ltr"
      >
        {/* metal clip */}
        <div className="mx-auto h-[1.5em] w-[2.5em] rounded-b-md rounded-t-sm bg-gradient-to-b from-zinc-200 to-zinc-500 shadow" />
        <div className="relative -mt-1 transition-transform duration-700 ease-[cubic-bezier(.3,1.3,.5,1)]" style={{ transformStyle: "preserve-3d", transform: `rotateY(${flipped ? 180 : 0}deg)` }}>
        {/* back: QR code to the site (tap / click the card to flip) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[0.8em] rounded-[1em] border border-white/15 bg-gradient-to-br from-[#2a1760] to-[#0f0c19] p-[1em]" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
          {qr && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qr} alt="QR code to sohila-portfolio-ten.vercel.app" className="w-[70%] rounded-[0.6em] bg-white p-[0.4em]" draggable={false} />
          )}
          <p className="text-[1.1em] font-extrabold">Scan to visit</p>
          <p className="text-[0.62em] text-accent-soft">sohila-portfolio-ten.vercel.app</p>
        </div>
        <div style={{ backfaceVisibility: "hidden" }} className={`overflow-hidden rounded-[1em] border border-white/15 bg-gradient-to-b from-[#1d1830] to-[#110e1c] shadow-[0_30px_60px_rgba(0,0,0,0.5)] ${glow ? "badge-glow" : "shadow-[0_0_40px_rgba(139,92,246,0.25)]"}`}>
          <div className="flex items-center justify-between bg-accent px-[1em] py-[0.5em] text-[0.62em] font-extrabold uppercase tracking-[0.25em]">
            <span>Developer</span>
            <span>{profile.year}</span>
          </div>
          <div className="mx-auto mt-[0.75em] h-[0.375em] w-[3.5em] rounded-full bg-black/50" />
          <BadgePhoto width={width} />
          <div className="px-[1.25em] pb-[1.25em] pt-[1em] text-center">
            <p className="font-display text-[1.25em] font-extrabold uppercase leading-tight">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="mt-[0.25em] text-[0.75em] font-semibold uppercase tracking-[0.2em] text-accent-soft">{profile.role}</p>
            <div className="mt-[1em] flex items-end justify-between border-t border-white/10 pt-[0.75em] text-left text-[0.62em] uppercase tracking-widest text-muted">
              <span>
                ID
                <br />
                <span className="text-fg">SE-{profile.year}</span>
              </span>
              <span aria-hidden className="flex h-[2.8em] items-end gap-[2px]">
                {[3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2].map((w, i) => (
                  <span key={i} className="h-full bg-fg/80" style={{ width: w * (width / 250) }} />
                ))}
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The photo on the badge with "expressions": the picture follows the cursor a little,
 * blinks with a quick squash now and then, sometimes pops a wink, and bounces happily on hover/tap.
 */
function BadgePhoto({ width }: { width: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const [pop, setPop] = useState<string | null>(null);

  useEffect(() => {
    if (prefersReduced()) return;
    const f = frame.current!;
    const i = img.current!;
    const px = gsap.quickTo(i, "x", { duration: 0.6, ease: "power3" });
    const py = gsap.quickTo(i, "y", { duration: 0.6, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = f.getBoundingClientRect();
      px(gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)) * 7);
      py(gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)) * 5);
    };
    window.addEventListener("pointermove", move);
    let t: ReturnType<typeof setTimeout>;
    let hide: ReturnType<typeof setTimeout>;
    const blink = () => {
      gsap.fromTo(f, { scaleY: 1 }, { scaleY: 0.95, scaleX: 1.02, duration: 0.09, yoyo: true, repeat: 1, ease: "power1.inOut", transformOrigin: "50% 40%" });
      if (Math.random() < 0.3) {
        setPop(Math.random() < 0.5 ? "😉" : "✨");
        hide = setTimeout(() => setPop(null), 1100);
      }
      t = setTimeout(blink, 2600 + Math.random() * 2800);
    };
    t = setTimeout(blink, 2000);
    return () => {
      clearTimeout(t);
      clearTimeout(hide);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  const happy = () => {
    if (prefersReduced()) return;
    gsap.fromTo(frame.current, { scale: 1 }, { scale: 1.07, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" });
    setPop("😊");
    setTimeout(() => setPop(null), 900);
  };

  return (
    <div className="relative mx-auto mt-[0.75em] w-[62%]" onPointerEnter={happy} onClick={happy}>
      <div ref={frame} className="relative aspect-square overflow-hidden rounded-[0.9em] border border-white/10 bg-gradient-to-b from-accent/30 to-transparent">
        <div ref={img} className="absolute -inset-[6%]">
          <Image src="/avatar/sohila.webp" alt="Sohila Ebrahim" fill sizes={`${Math.round(width * 0.7)}px`} className="pointer-events-none object-cover" draggable={false} />
        </div>
      </div>
      <span
        aria-hidden
        className={`absolute -right-[0.6em] -top-[0.6em] text-[1.6em] transition-all duration-300 ${pop ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
      >
        {pop ?? "😉"}
      </span>
    </div>
  );
}
