"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReduced } from "@/lib/gsap";

/**
 * Sohila's cartoon portrait (public/avatar/sohila.webp) in a soft rounded frame.
 * Floats gently and tilts toward the cursor. Swap the picture by replacing that one file.
 */
export default function Avatar({ className = "", rounded = "rounded-[28%]", sizes = "300px" }: { className?: string; rounded?: string; sizes?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const inner = el.firstElementChild as HTMLElement;
    const float = gsap.to(inner, { y: -8, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const rx = gsap.quickTo(inner, "rotationX", { duration: 0.8, ease: "power3" });
    const ry = gsap.quickTo(inner, "rotationY", { duration: 0.8, ease: "power3" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2));
      const dy = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2));
      ry(dx * 10);
      rx(-dy * 8);
    };
    window.addEventListener("pointermove", move);
    return () => {
      float.kill();
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div ref={ref} className={`[perspective:700px] ${className}`}>
      <div className={`relative overflow-hidden ${rounded} ring-2 ring-accent/70 shadow-[0_0_40px_rgba(139,92,246,.45)] will-change-transform`}>
        <Image src="/avatar/sohila.webp" alt="Sohila Ebrahim" width={400} height={400} sizes={sizes} className="h-auto w-full" />
      </div>
    </div>
  );
}
