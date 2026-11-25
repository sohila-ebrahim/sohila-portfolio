import { iconMap } from "@/lib/icons";



/** Brand logo from simple-icons, or a monogram badge when no logo exists. */
export default function TechIcon({ name, icon, size = 22, mono = false }: { name: string; icon?: string; size?: number; mono?: boolean }) {
  const si = icon ? iconMap[icon] : undefined;
  if (!si) {
    return (
      <span
        aria-hidden
        style={{ width: size, height: size, fontSize: size * 0.42 }}
        className="inline-flex shrink-0 items-center justify-center rounded-md bg-accent/20 font-bold text-accent-soft"
      >
        {name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase()}
      </span>
    );
  }
  // very dark brand colours are invisible on the dark background
  const hex = parseInt(si.hex, 16);
  const lum = 0.299 * (hex >> 16) + 0.587 * ((hex >> 8) & 255) + 0.114 * (hex & 255);
  const fill = mono || lum < 60 ? "#ece9f5" : `#${si.hex}`;
  return (
    <svg role="img" aria-label={name} width={size} height={size} viewBox="0 0 24 24" className="shrink-0" fill={fill}>
      <path d={si.path} />
    </svg>
  );
}
