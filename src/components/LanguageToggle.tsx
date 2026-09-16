import { FlagBR, FlagCL } from "@/components/Flags";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

const options = [
  {
    value: "pt",
    name: "Português",
    locale: "pt-BR",
    Flag: FlagBR,
    flagClass: "w-[17px]",
  },
  {
    value: "es",
    name: "Español",
    locale: "es-CL",
    Flag: FlagCL,
    flagClass: "w-[18px]",
  },
] as const;

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
      {options.map(({ value, name, locale, Flag, flagClass }) => (
        <button
          key={value}
          type="button"
          onClick={() => setLang(value)}
          aria-pressed={lang === value}
          aria-label={name}
          title={name}
          lang={locale}
          className={cn(
            "inline-flex min-h-9 items-center rounded-full px-2.5 transition-colors",
            lang === value ? "bg-terracotta" : "opacity-60 hover:opacity-100",
          )}
        >
          <Flag className={cn("h-3 shrink-0 rounded-[2px] ring-1 ring-black/10", flagClass)} />
        </button>
      ))}
    </div>
  );
}
