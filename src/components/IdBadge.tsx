"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { prefersReduced } from "@/lib/gsap";
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
    const down = (e: PointerEvent) => {
      if (reduce) return;
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
        style={{ width, transformOrigin: `${width / 2}px 0px`, cursor: "grab", touchAction: "none", fontSize: fs }}
        className="absolute left-0 top-0 will-change-transform"
        aria-label={`ID badge: ${profile.firstName} ${profile.lastName}, ${profile.role}`}
        dir="ltr"
      >
        {/* metal clip */}
        <div className="mx-auto h-[1.5em] w-[2.5em] rounded-b-md rounded-t-sm bg-gradient-to-b from-zinc-200 to-zinc-500 shadow" />
        <div className={`-mt-1 overflow-hidden rounded-[1em] border border-white/15 bg-gradient-to-b from-[#1d1830] to-[#110e1c] shadow-[0_30px_60px_rgba(0,0,0,0.5)] ${glow ? "badge-glow" : "shadow-[0_0_40px_rgba(139,92,246,0.25)]"}`}>
          <div className="flex items-center justify-between bg-accent px-[1em] py-[0.5em] text-[0.62em] font-extrabold uppercase tracking-[0.25em]">
            <span>Developer</span>
            <span>{profile.year}</span>
          </div>
          <div className="mx-auto mt-[0.75em] h-[0.375em] w-[3.5em] rounded-full bg-black/50" />
          <div className="relative mx-auto mt-[0.75em] aspect-square w-[62%] overflow-hidden rounded-[0.9em] border border-white/10 bg-gradient-to-b from-accent/30 to-transparent">
            <Image src="/avatar/sohila.webp" alt="Sohila Ebrahim" fill sizes={`${Math.round(width * 0.62)}px`} className="pointer-events-none object-cover" draggable={false} />
          </div>
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
  );
}
