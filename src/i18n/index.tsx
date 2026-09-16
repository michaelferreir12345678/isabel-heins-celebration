import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { pt, type Dictionary } from "./pt";
import { es } from "./es";

export type Lang = "pt" | "es";

const dictionaries: Record<Lang, Dictionary> = { pt, es };
const STORAGE_KEY = "isabel-heins-lang";

type I18nValue = {
  lang: Lang;
  t: Dictionary;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "pt" || stored === "es") {
      setLangState(stored);
      return;
    }
    if (navigator.language?.toLowerCase().startsWith("es")) setLangState("es");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "es" ? "es-CL" : "pt-BR";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      t: dictionaries[lang],
      setLang,
      toggle: () => setLang(lang === "pt" ? "es" : "pt"),
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
