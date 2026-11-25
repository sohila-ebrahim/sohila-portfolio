"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fullDict as dict, type Dict, type Lang } from "@/data/i18n";
import { ScrollTrigger } from "@/lib/gsap";

const Ctx = createContext<{ lang: Lang; t: Dict; setLang: (l: Lang) => void }>({ lang: "en", t: dict.en, setLang: () => {} });

/** English by default; Arabic switches the whole page to RTL. The choice is remembered. */
export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("lang");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    // layout changes size; let pinned sections re-measure
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("lang", l);
  }, []);

  return <Ctx.Provider value={{ lang, t: dict[lang] as Dict, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
