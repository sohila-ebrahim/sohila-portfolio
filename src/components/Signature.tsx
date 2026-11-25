"use client";
import { useRef } from "react";
import { gsap, prefersReduced, useGSAP } from "@/lib/gsap";
import { LOADED_EVENT } from "@/lib/scroll";

/** Handwritten "Sohila" that draws itself with an SVG stroke after the preloader. */
export default function Signature({ className = "" }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      const txt = ref.current!.querySelector("text")!;
      if (prefersReduced()) {
        gsap.set(txt, { strokeDashoffset: 0, fillOpacity: 1 });
        return;
      }
      const tl = gsap.timeline({ paused: true });
      tl.fromTo(txt, { strokeDashoffset: 1600 }, { strokeDashoffset: 0, duration: 2.6, ease: "power2.inOut" }).to(txt, { fillOpacity: 1, duration: 0.8 }, "-=0.6");
      const play = () => tl.play();
      if (!document.querySelector(".pl-char")) play();
      else window.addEventListener(LOADED_EVENT, play, { once: true });
      return () => window.removeEventListener(LOADED_EVENT, play);
    },
    { scope: ref }
  );
  return (
    <svg ref={ref} viewBox="0 0 520 180" className={className} aria-label="Sohila signature" role="img">
      <text
        x="10"
        y="135"
        fontFamily="var(--font-sign), cursive"
        fontSize="150"
        fill="#ede9fe"
        fillOpacity="0"
        stroke="#ede9fe"
        strokeWidth="1.6"
        strokeDasharray="1600"
        strokeDashoffset="1600"
      >
        Sohila
      </text>
    </svg>
  );
}
