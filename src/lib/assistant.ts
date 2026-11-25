import { education, experience, expertise, languages, profile, projects, services, stack } from "@/data/portfolio";

/** Everything the assistant is allowed to know, built from the site's own data. */
export function knowledge(): string {
  const p = projects
    .map((x) => `- ${x.title} (${x.kind}, ${x.category}): ${x.description} Tech: ${x.tags.join(", ")}. ${x.liveUrl ? `Live: ${x.liveUrl}` : "Private client project, no public link."}`)
    .join("\n");
  return [
    `Name: Sohila Ebrahim. Role: ${profile.role}. Location: ${profile.location}. ${profile.availability}.`,
    `Intro: ${profile.intro}`,
    `Summary: ${profile.summary}`,
    `Education: ${education.map((e) => `${e.period} ${e.degree ? e.degree + ", " : ""}${e.school}`).join("; ")}.`,
    `Languages: ${languages.map((l) => l.name + (l.level ? ` (${l.level})` : "")).join(", ")}. Expertise: ${expertise.join(", ")}.`,
    `Bio: ${profile.bio.join(" ")}`,
    `Contact: email ${profile.email}, phone/WhatsApp ${profile.phone} (${profile.whatsapp}), GitHub https://github.com/sohilaebrahim00.`,
    `Services:\n${services.map((s) => `- ${s.title}: ${s.description} (${s.points.join(", ")})`).join("\n")}`,
    `Experience:\n${experience.map((e) => `- ${e.role}, ${e.company}, ${e.period}: ${e.points.join(" ")}`).join("\n")}`,
    `Stack:\n${stack.map((g) => `- ${g.group}: ${g.items.map((i) => i.name).join(", ")}`).join("\n")}`,
    `Projects (${projects.length}):\n${p}`,
  ].join("\n\n");
}

export const systemPrompt = () =>
  `You are "Ask Sohila", the assistant on Sohila Ebrahim's portfolio website. Answer visitors' questions about Sohila's work, skills, services, projects and how to contact her, using only the facts below. If something isn't covered, say you don't know and suggest contacting her on WhatsApp or email. Never invent clients, prices, dates, reviews or links. Reply in the same language the visitor writes in (Arabic in Egyptian dialect if they write Arabic). Keep answers short and friendly: 2-5 sentences or a short list, and include the live link when you mention a project that has one. Speak about Sohila in the third person.

<facts>
${knowledge()}
</facts>`;

/** Keyword fallback used when no API key is configured, so the widget still answers. */
export function localAnswer(q: string, lang: "en" | "ar"): string {
  const s = q.toLowerCase();
  const ar = lang === "ar" || /[؀-ۿ]/.test(q);
  const has = (...w: string[]) => w.some((x) => s.includes(x));
  const live = projects.filter((x) => x.liveUrl);

  if (has("contact", "email", "whatsapp", "phone", "hire", "reach", "تواصل", "رقم", "واتس", "ايميل", "إيميل", "أكلم", "اكلم", "اتواصل", "أتواصل"))
    return ar
      ? `تقدر تكلّم سهيلة على واتساب ${profile.phone} (${profile.whatsapp}) أو على الإيميل ${profile.email}.`
      : `You can reach Sohila on WhatsApp at ${profile.phone} (${profile.whatsapp}) or by email at ${profile.email}.`;
  if (has("stack", "tech", "technolog", "tools", "language", "framework", "تقنيات", "أدوات", "ادوات", "لغات"))
    return (ar ? "أهم الأدوات اللي سهيلة بتستخدمها:\n" : "Sohila's main tools:\n") + stack.map((g) => `• ${g.group}: ${g.items.slice(0, 8).map((i) => i.name).join(", ")}`).join("\n");
  if (has("project", "work", "portfolio", "best", "مشروع", "مشاريع", "شغل"))
    return (ar ? "بعض أحسن مشاريع سهيلة:\n" : "Some of Sohila's best projects:\n") + live.slice(0, 5).map((x) => `• ${x.title}: ${x.liveUrl}`).join("\n");
  if (has("service", "build", "do", "offer", "خدم", "بتعمل", "بتعملي", "تعمل"))
    return (ar ? "سهيلة بتقدّم:\n" : "Sohila offers:\n") + services.map((x) => `• ${x.title}`).join("\n");
  if (has("price", "cost", "rate", "سعر", "تكلفة", "بكام"))
    return ar ? `الأسعار بتختلف حسب المشروع. ابعت تفاصيل مشروعك لسهيلة على واتساب ${profile.phone} وهترد عليك.` : `Pricing depends on the project. Send Sohila the details on WhatsApp (${profile.phone}) and she'll get back to you.`;
  return ar
    ? `سهيلة ${profile.role} بتبني مواقع وتطبيقات ويب وموبايل وأنظمة. اسأل عن مشاريعها أو أدواتها أو إزاي تتواصل معاها.`
    : `Sohila is a ${profile.role} who builds websites, web and mobile apps and back-end systems. Ask about her projects, her stack or how to contact her.`;
}
