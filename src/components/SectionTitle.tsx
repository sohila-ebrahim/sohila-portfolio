"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import SplitText from "./SplitText";

/** Big heading: the words reveal char by char; `accent` words are tinted. */
export default function SectionTitle({ text, accent, eyebrow, className = "" }: { text: string; accent?: string; eyebrow?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.from(".char", {
        yPercent: 110,
        rotate: 6,
        duration: 1,
        ease: "power4.out",
        stagger: 0.025,
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={className}>
      {eyebrow && (
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">
          <span className="text-accent">✸</span> {eyebrow}
        </p>
      )}
      <h2 className="font-display text-[13vw] font-extrabold uppercase leading-[1.1] md:text-[8vw] lg:text-[117px]">
        <SplitText text={text} />
        {accent && (
          <>
            {" "}
            <SplitText text={accent} className="text-accent" />
          </>
        )}
      </h2>
    </div>
  );
}
