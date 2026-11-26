import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { education, experience, expertise, languages, profile, projects, stack } from "@/data/portfolio";

/** Print-friendly A4 CV built only from the site's data. /cv/en and /cv/ar. */
const copy = {
  en: {
    name: "SOHILA EBRAHIM",
    role: "Full Stack Developer",
    summaryTitle: "Profile",
    summary: `${profile.summary} ${profile.bio[1]}`,
    education: "Education",
    languages: "Languages",
    expertise: "Expertise",
    skills: "Skills",
    exp: "Experience",
    projects: "Selected projects",
    portfolio: "Portfolio",
    location: "Sadat City, Egypt",
  },
  ar: {
    name: "سهيلة إبراهيم",
    role: "مطوّرة Full Stack",
    summaryTitle: "نبذة",
    summary: "طالبة في سنة تالتة هندسة برمجيات في جامعة الدلتا التكنولوجية، ومطوّرة Full Stack ببني مواقع ولوحات تحكم وتطبيقات ويب عن بُعد لعملاء في أمريكا والإمارات. بهتم بالتفاصيل اللي المستخدم بيحسها: سرعة التحميل، الحركة الناعمة، الخطوات الواضحة، وكود سهل يكبر.",
    education: "التعليم",
    languages: "اللغات",
    expertise: "مجالات الخبرة",
    skills: "المهارات",
    exp: "الخبرة",
    projects: "مشاريع مختارة",
    portfolio: "البورتفوليو",
    location: "مدينة السادات، مصر",
  },
};

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }];
}

export const metadata: Metadata = { title: "Sohila Ebrahim — CV", robots: { index: false } };

export default async function CvPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "ar") notFound();
  const c = copy[lang];
  const selected = projects.filter((p) => p.liveUrl).slice(0, 8);
  const host = (u: string) => u.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <main dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} className={`cv-page mx-auto min-h-screen ${lang === "ar" ? "font-ar" : ""} max-w-[210mm] bg-white px-[14mm] py-[12mm] text-[10.5pt] leading-snug text-[#1c1530]`}>
      <style>{`header, .grain, [data-floating] { display: none !important; } html, a, button { cursor: auto !important; } html, body { background: #ece9f5 !important; } @media print { html, body { background: #fff !important; } } @page { size: A4; margin: 0; }`}</style>

      <div className="flex items-end justify-between gap-6 border-b-[3px] border-[#8b5cf6] pb-4">
        <div>
          <h1 className="text-[28pt] font-extrabold leading-none tracking-tight">{c.name}</h1>
          <p className="mt-1 text-[13pt] font-semibold text-[#7c3aed]">{c.role}</p>
        </div>
        <div className="text-end text-[9pt] leading-relaxed text-[#4b4462]" dir="ltr">
          <p>{profile.phone}</p>
          <p>{profile.email}</p>
          <p>sohila-portfolio-ten.vercel.app</p>
          <p>github.com/sohila-ebrahim · {c.location}</p>
        </div>
      </div>

      <section className="mt-5">
        <h2 className="cv-h">{c.summaryTitle}</h2>
        <p className="mt-1.5 text-[#3b3450]">{c.summary}</p>
      </section>

      <section className="mt-5">
        <h2 className="cv-h">{c.skills}</h2>
        <div className="mt-1.5 space-y-1.5" dir="ltr">
          {stack.map((g) => (
            <p key={g.group} className={lang === "ar" ? "text-end" : ""}>
              <span className="font-bold text-[#1c1530]">{g.group}: </span>
              <span className="text-[#3b3450]">{g.items.map((i) => i.name).join(", ")}</span>
            </p>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="cv-h">{c.exp}</h2>
        <div className="mt-1.5 space-y-3">
          {experience.map((e) => (
            <div key={e.role + e.period} dir="ltr" className={lang === "ar" ? "text-right" : ""}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-bold">{e.role} <span className="font-normal text-[#6b6480]">· {e.company}</span></p>
                <p className="shrink-0 text-[9pt] font-semibold text-[#7c3aed]" dir="ltr">{e.period}</p>
              </div>
              <ul className="mt-1 list-disc space-y-0.5 ps-5 text-left text-[#3b3450]">
                {e.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5 grid grid-cols-[1.4fr_1fr] gap-8">
        <div>
          <h2 className="cv-h">{c.education}</h2>
          <div className="mt-1.5 space-y-1.5" dir="ltr">
            {education.map((e) => (
              <div key={e.school} className={`flex items-baseline justify-between gap-4 ${lang === "ar" ? "text-right" : ""}`}>
                <p><span className="font-bold">{e.school}</span>{e.degree && <span className="text-[#6b6480]"> · {e.degree}</span>}</p>
                <p className="shrink-0 text-[9pt] font-semibold text-[#7c3aed]">{e.period}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="cv-h">{c.languages}</h2>
          <p className="mt-1.5" dir="ltr">{languages.map((l) => l.name + (l.level ? ` (${l.level})` : "")).join(" · ")}</p>
          <h2 className="cv-h mt-3">{c.expertise}</h2>
          <p className="mt-1.5" dir="ltr">{expertise.join(" · ")}</p>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="cv-h">{c.projects}</h2>
        <div className="mt-1.5 grid grid-cols-2 gap-x-6 gap-y-2.5">
          {selected.map((p) => (
            <div key={p.slug} className="break-inside-avoid" dir="ltr">
              <p className="font-bold">{p.title}</p>
              <p className="text-[9pt] text-[#3b3450]">{p.description}</p>
              <p className="text-[8.5pt] text-[#6b6480]" dir="ltr">{p.tags.slice(0, 4).join(" · ")} — <span className="text-[#7c3aed]">{host(p.liveUrl!)}</span></p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-6 border-t border-[#e4e0ee] pt-3 text-center text-[8.5pt] text-[#6b6480]" dir="ltr">
        {c.portfolio}: https://sohila-portfolio-ten.vercel.app
      </p>
    </main>
  );
}
