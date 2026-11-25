import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects } from "@/data/portfolio";
import ProjectImage from "@/components/ProjectImage";
import ProjectLinks from "@/components/ProjectLinks";
import Reveal from "@/components/Reveal";
import LivePreview from "@/components/LivePreview";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return { title: p ? `${p.title} — Sohila Ebrahim` : "Project", description: p?.description };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <main className="px-site pb-20 pt-32 md:pt-36">
      <Link href="/#portfolio" className="text-sm text-muted link-underline">← Back to all projects</Link>
      <Reveal className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-soft">{p.category} · {p.kind} · {p.year}{p.country && <span className="ms-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-fg">{p.country}</span>}</p>
        <h1 className="mt-4 max-w-6xl font-display text-5xl font-bold uppercase leading-[0.95] md:text-8xl">{p.title}</h1>
        <div className="mt-8">
          <ProjectLinks project={p} details={false} />
        </div>
      </Reveal>

      <Reveal delay={0.2} className="mt-14">
        {p.liveUrl ? (
          <LivePreview project={p} />
        ) : (
          <div className="aspect-[16/9] overflow-hidden rounded-3xl border border-line">
            <ProjectImage project={p} index={index} />
          </div>
        )}
      </Reveal>

      <Reveal childrenStagger className="mt-14 grid gap-10 md:grid-cols-[2fr_1fr]">
        <div className="space-y-5 text-lg leading-relaxed text-fg/80">
          <p>{p.longDescription ?? p.description}</p>
          {!p.liveUrl && (
            <p className="rounded-2xl border border-dashed border-white/15 p-5 text-base text-muted">
              🔒 This is private client work (an internal system, a mobile app or a back-end), so there is no public link. Ask me for a walkthrough.
            </p>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted">Technologies</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tags.map((t) => <span key={t} className="rounded-full border border-line px-3 py-1 text-sm">{t}</span>)}
            </div>
          </div>
          {p.liveUrl && (
            <div>
              <h2 className="text-xs uppercase tracking-[0.3em] text-muted">Live at</h2>
              <a href={p.liveUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block break-all font-semibold text-accent-soft link-underline">
                {p.liveUrl.replace(/^https?:\/\//, "")} ↗
              </a>
            </div>
          )}
        </div>
      </Reveal>

      <Link href={`/projects/${next.slug}`} className="group mt-32 block border-t border-line pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Next project</p>
        <p className="mt-4 font-display text-4xl font-bold uppercase transition group-hover:text-accent md:text-7xl">{next.title} →</p>
      </Link>
    </main>
  );
}
