import type { Project } from "@/data/portfolio";

const gradients = [
  "from-violet-600 via-fuchsia-700 to-indigo-900",
  "from-indigo-500 via-violet-700 to-slate-900",
  "from-fuchsia-500 via-purple-700 to-zinc-900",
  "from-purple-500 via-indigo-800 to-slate-950",
];

/** Shows the project screenshot, or a gradient card with the title when there is none. */
export default function ProjectImage({ project, index = 0, className = "" }: { project: Project; index?: number; className?: string }) {
  if (project.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" className={`h-full w-full object-cover object-top ${className}`} />;
  }
  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br ${gradients[index % gradients.length]} ${className}`}>
      <div aria-hidden className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:40px_40px]" />
      <span className="relative text-xs font-semibold uppercase tracking-[0.3em] text-white/70">{project.category}</span>
      <span className="relative px-6 text-center font-display text-2xl font-bold uppercase text-white md:text-4xl">{project.title.split("—")[0]}</span>
    </div>
  );
}
