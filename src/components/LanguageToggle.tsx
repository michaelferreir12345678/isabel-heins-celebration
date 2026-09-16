import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-terracotta/30 bg-paper/70 p-0.5 backdrop-blur",
        className,
      )}
      role="group"
      aria-label={t.switchTo}
    >
      {(["pt", "es"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          aria-pressed={lang === option}
          className={cn(
            "min-h-9 rounded-full px-3 text-xs tracking-[0.2em] uppercase transition-colors",
            lang === option
              ? "bg-terracotta text-primary-foreground"
              : "text-muted-foreground hover:text-ink",
          )}
        >
          {option === "pt" ? "PT" : "ES"}
        </button>
      ))}
    </div>
  );
}
