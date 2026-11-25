"use client";
import Image from "next/image";
import { scrollToTarget } from "@/lib/scroll";
import { liveProjects, projects } from "@/data/portfolio";
import TechIcon from "./TechIcon";

const tools = [
  { name: "Next.js", icon: "siNextdotjs", bg: "#0b0b0f" },
  { name: "React", icon: "siReact", bg: "#0f1a2b" },
  { name: "TypeScript", icon: "siTypescript", bg: "#ffffff" },
  { name: "Node.js", icon: "siNodedotjs", bg: "#10220f" },
  { name: "Tailwind CSS", icon: "siTailwindcss", bg: "#0c1a2a" },
  { name: "Supabase", icon: "siSupabase", bg: "#11201a" },
  { name: "GSAP", icon: "siGsap", bg: "#12160d" },
];

/** Four cards under the hero: three white folders and a dark "tools" card (RTL order like the reference). */
export default function HeroCards() {
  const thumbs = projects.filter((p) => p.image && p.liveUrl).slice(0, 3);
  return (
    <div dir="rtl" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4">
      <Folder
        title="المشاريع"
        subtitle="افتح الفولدر، شوف التفاصيل."
        sheet={projects[0].title.split("—")[0].trim()}
        onClick={() => scrollToTarget("#projects")}
        peek={
          <div className="absolute inset-x-6 top-2 h-28">
            {thumbs.map((p, i) => (
              <div
                key={p.slug}
                className="absolute left-1/2 top-0 h-24 w-36 -translate-x-1/2 overflow-hidden rounded-lg border border-black/10 bg-white shadow-md transition-transform duration-500 ease-out group-hover:[transform:translateX(var(--tx))_translateY(-34px)_rotate(var(--rot))]"
                style={{ ["--tx" as string]: `${(i - 1) * 70 - 50}%`, ["--rot" as string]: `${(i - 1) * 10}deg`, zIndex: i }}
              >
                <Image src={p.image!} alt="" fill sizes="144px" className="object-cover object-top" />
              </div>
            ))}
          </div>
        }
      />
      <Folder
        title={`+${liveProjects.length} شريك نجاح`}
        subtitle="بنبني الثقة، مشروع ورا مشروع."
        sheet="حلول تناسب أعمالك"
        onClick={() => scrollToTarget("#portfolio")}
      />
      <Folder title="عندك فكرة؟" subtitle="ابدأ مشروعك معانا." sheet="اكتشف الحلول" onClick={() => scrollToTarget("#contact")} />

      {/* dark tools card with a fan of app icons sticking out of the top */}
      <div className="hc-card"><div className="group relative mt-10 flex min-h-[230px] flex-col justify-end overflow-visible rounded-[26px] border border-white/10 bg-[#15121f] p-6 transition-transform duration-500 hover:-translate-y-2">
        <div className="absolute -top-10 left-1/2 flex -translate-x-1/2">
          {tools.map((t, i) => (
            <span
              key={t.name}
              title={t.name}
              className="-ml-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 shadow-[0_10px_25px_rgba(0,0,0,.45),inset_0_1px_0_rgba(255,255,255,.25)] transition-transform duration-500 first:ml-0 group-hover:-translate-y-2"
              style={{ background: t.bg, transform: `rotate(${(i - (tools.length - 1) / 2) * 8}deg) translateY(${Math.abs(i - (tools.length - 1) / 2) * 6}px)`, zIndex: tools.length - Math.abs(i - 3) }}
            >
              <TechIcon name={t.name} icon={t.icon} size={26} />
            </span>
          ))}
        </div>
        <h3 className="font-ar text-xl font-bold text-white">الأدوات اللي ببني بيها.</h3>
        <div className="mt-4 flex flex-wrap gap-2" dir="ltr">
          {["Next.js", "React", "TypeScript", "Node.js", "Tailwind", "Supabase"].map((c) => (
            <span key={c} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">{c}</span>
          ))}
        </div>
      </div></div>
    </div>
  );
}

/** White glossy folder: back with a tab, a paper sheet peeking out, front panel with the text. */
function Folder({ title, subtitle, sheet, onClick, peek }: { title: string; subtitle: string; sheet: string; onClick: () => void; peek?: React.ReactNode }) {
  return (
    <div className="hc-card"><button onClick={onClick} className="group relative mt-10 block h-[230px] w-full text-right transition-transform duration-500 hover:-translate-y-2">
      {/* back of the folder + tab */}
      <span aria-hidden className="absolute right-0 top-0 h-9 w-32 rounded-t-2xl bg-[#d9d5e4]" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 top-6 rounded-[22px] rounded-tr-none bg-gradient-to-b from-[#e4e0ee] to-[#cfcadd]" />
      {/* paper sheet, or project thumbnails */}
      {peek ?? (
        <span className="absolute inset-x-8 top-10 h-28 rounded-lg bg-white px-4 pt-3 text-sm font-semibold text-[#6b6480] shadow-md transition-transform duration-500 ease-out group-hover:-translate-y-6 group-hover:-rotate-2">
          {sheet}
          <span className="mt-2 block h-1.5 w-2/3 rounded-full bg-[#ece9f3]" />
          <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-[#ece9f3]" />
        </span>
      )}
      {/* front panel */}
      <span className="absolute inset-x-0 bottom-0 flex h-[62%] flex-col justify-end rounded-[22px] bg-gradient-to-b from-white to-[#f1eff6] p-6 shadow-[0_-8px_24px_rgba(0,0,0,.12),inset_0_1px_0_#fff] transition-[transform] duration-500 [transform-origin:bottom] group-hover:[transform:perspective(600px)_rotateX(-14deg)]">
        <span className="font-ar text-2xl font-extrabold text-[#151122]">{title}</span>
        <span className="mt-1 font-ar text-sm text-[#7b7590]">{subtitle}</span>
      </span>
    </button></div>
  );
}
