"use client";
import { useRef } from "react";
import { useLang } from "@/lib/lang";
import { gsap, useGSAP } from "@/lib/gsap";
import { stack } from "@/data/portfolio";
import TechIcon from "./TechIcon";

/** "My stack": big sticky category titles on the left, a grid of real brand logos on the right. */
export default function TechStack() {
  const ref = useRef<HTMLElement>(null);
  const { t } = useLang();
  useGSAP(
    () => {
      gsap.from(".ts-head", { y: 40, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 80%" } });
      gsap.utils.toArray<HTMLElement>(".ts-group").forEach((g) => {
        gsap.from(g.querySelectorAll(".ts-item"), { y: 30, opacity: 0, scale: 0.9, stagger: 0.04, duration: 0.7, ease: "back.out(1.8)", scrollTrigger: { trigger: g, start: "top 80%" } });
      });
    },
    { scope: ref }
  );

  return (
    <section id="stack" ref={ref} className="px-site w-full bg-[#0b0a13] py-20 md:py-28">
      <h2 className="ts-head flex items-center gap-3 font-display text-3xl font-bold uppercase md:text-[42px]">
        <span className="text-accent">✸</span> {t.myStack} <span className="text-accent">{t.myStackAccent}</span>
      </h2>
      <div className="mt-14 space-y-4">
        {stack.map((g) => (
          <div key={g.group} className="ts-group grid gap-8 border-t border-line pt-10 lg:grid-cols-[340px_1fr] lg:gap-12">
            <div>
              <h3 className="font-display text-2xl font-bold uppercase leading-tight text-fg/90 lg:sticky lg:top-28 lg:text-[28px]">
                {g.group}
                <span className="mt-2 block text-sm font-semibold normal-case tracking-wide text-accent-soft">{t.toolsCount(g.items.length)}</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3 pb-10 sm:grid-cols-3 xl:grid-cols-4">
              {g.items.map((it) => (
                <div key={it.name} className="ts-item">
                <div
                  className="group flex h-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 transition duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-accent/10 hover:shadow-[0_12px_30px_rgba(139,92,246,.25)]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] transition group-hover:scale-110">
                    <TechIcon name={it.name} icon={it.icon} size={22} />
                  </span>
                  <span className="text-[15px] font-bold" dir="ltr">{it.name}</span>
                </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
