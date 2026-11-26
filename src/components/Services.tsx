"use client";
import { useRef } from "react";
import { useLang } from "@/lib/lang";
import { gsap, prefersReduced, useGSAP } from "@/lib/gsap";
import { services } from "@/data/portfolio";
import SectionTitle from "./SectionTitle";
import Reveal from "./Reveal";

const icons = ["◐", "▦", "▣", "⌁", "✦"];
const grads = [
  "from-violet-400 to-indigo-700",
  "from-fuchsia-400 to-purple-700",
  "from-pink-400 to-rose-600",
  "from-sky-400 to-indigo-700",
  "from-emerald-400 to-teal-700",
];

// Arabic copy for the same five services (English lives in portfolio.ts)
const servicesAr = [
  { title: "تطوير المواقع", description: "مواقع حديثة متجاوبة معمولة على مقاس براندك وأهدافك: صفحات هبوط، مواقع شركات ووكالات، مطاعم ومشاريع عقارية.", points: ["صفحات هبوط ومواقع شركات", "مواقع بأكتر من لغة (عربي / إنجليزي / إسباني)", "SEO و Core Web Vitals"] },
  { title: "تطبيقات ويب ومتاجر", description: "منتجات كاملة فيها حسابات ومدفوعات ولوحات تحكم: حجز، طلبات أونلاين، متاجر ولوحات إدارة بتشغّل الشغل اليومي.", points: ["تطبيقات Next.js و React", "Stripe و Clover POS والمدفوعات", "لوحات إدارة وديسباتش"] },
  { title: "تطبيقات موبايل", description: "تطبيقات iOS و Android بكود واحد، فيها خرايط وتتبع لحظي وإشعارات ومدفوعات.", points: ["React Native و Expo", "Flutter", "Capacitor و PWA"] },
  { title: "باك إند وربط خدمات", description: "APIs وطبقات داتا بتشغّل التطبيقات: تسجيل دخول، تحديثات لحظية، تخزين ملفات، رسايل وإيميلات.", points: ["Node.js و Express و NestJS", "Supabase و PostgreSQL و Prisma", "Twilio و Resend و WebSockets"] },
  { title: "حركة وتفاعل", description: "قصص بتتحكي مع السكرول، مشاهد 3D وتفاصيل صغيرة بتخلّي المنتج حي من غير ما يبطّأ.", points: ["GSAP و ScrollTrigger", "Three.js و React Three Fiber", "سكرول ناعم بـ Lenis"] },
];

/**
 * "What I do /" as stacked layers: every service is a full-width card that sticks,
 * and the next card slides up over it while the one underneath shrinks and dims.
 */
export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const list = lang === "ar" ? servicesAr : services;

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".svc-card");
      const light = window.innerWidth < 768 || prefersReduced();
      if (light) {
        // phones: no stacking, just a soft fade/slide-in per card
        cards.forEach((card) => gsap.from(card, { y: 40, opacity: 0, duration: 0.7, ease: "power2.out", scrollTrigger: { trigger: card, start: "top 88%" } }));
        return;
      }
      cards.forEach((card, i) => {
        if (i < cards.length - 1) {
          gsap.to(card.querySelector(".svc-inner"), {
            scale: 0.9,
            opacity: 0.45,
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 25%", scrub: true },
          });
        }
        gsap.from(card.querySelectorAll(".svc-anim"), { y: 40, opacity: 0, stagger: 0.08, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 70%" } });
      });
    },
    { scope: ref, dependencies: [lang], revertOnUpdate: true }
  );

  return (
    <section id="services" ref={ref} className="px-site relative bg-surface pb-24 pt-28 md:pb-32">
      <SectionTitle text={t.whatIDo} accent={t.whatIDoAccent} />
      <div className="mt-12 grid gap-6 md:grid-cols-[1fr_1fr]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted md:text-center">{t.servicesLabel}</p>
        <Reveal>
          <p className="max-w-md text-lg leading-relaxed text-fg/80 md:text-xl">{t.servicesIntro}</p>
        </Reveal>
      </div>

      <div className="mt-16">
        {list.map((s, i) => (
          <div key={s.title} className="svc-card pb-4 md:sticky md:pb-6" style={{ top: `calc(96px + ${i * 18}px)` }}>
            <article className="svc-inner grid origin-top md:min-h-[58svh] gap-8 rounded-[32px] border border-white/10 bg-gradient-to-br from-[#1c1733] to-[#0f0c19] p-6 md:shadow-[0_-24px_60px_rgba(0,0,0,.5)] md:grid-cols-[auto_1fr_1fr] md:items-center md:gap-14 md:p-12">
              <div className="flex items-center gap-5 md:flex-col md:items-start">
                <span className={`flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br ${grads[i % grads.length]} text-3xl text-white shadow-[0_12px_28px_rgba(91,33,182,.35),inset_0_2px_0_rgba(255,255,255,.5)]`}>
                  {icons[i % icons.length]}
                </span>
                <span className="font-heavy text-6xl leading-none text-brand md:text-[120px]">({String(i + 1).padStart(2, "0")})</span>
              </div>
              <div>
                <h3 className="svc-anim font-display text-3xl font-bold leading-tight md:text-5xl">{s.title}</h3>
                <p className="svc-anim mt-4 max-w-lg text-fg/70 md:text-lg">{s.description}</p>
              </div>
              <ul className="divide-y divide-line border-t border-line">
                {s.points.map((p, k) => (
                  <li key={p} className="svc-anim flex items-center gap-4 py-4 text-lg font-semibold">
                    <span className="text-xs text-accent">0{k + 1}</span> {p}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
