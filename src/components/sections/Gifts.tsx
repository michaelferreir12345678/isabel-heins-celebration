import { useEffect, useState } from "react";
import { Check, Coffee, Copy, Heart, Home, Plane, Stars, Wine, X } from "lucide-react";

import { Section } from "@/components/Section";
import { payment } from "@/data/site";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

const icons = [Wine, Coffee, Plane, Home, Stars, Heart];

function CopyField({ label, value }: { label: string; value: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-sm border border-terracotta/20 bg-paper/70 px-4 py-3">
      <div className="min-w-0">
        <p className="kicker">{label}</p>
        <p className="mt-1 truncate font-display text-lg text-ink">{value}</p>
      </div>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-terracotta/40 px-4 text-xs tracking-[0.14em] text-terracotta uppercase"
      >
        {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        {copied ? t.gifts.modal.copied : t.gifts.modal.copy}
      </button>
    </div>
  );
}

export function Gifts() {
  const { t } = useI18n();
  const [openGift, setOpenGift] = useState<string | null>(null);
  const [tab, setTab] = useState<"br" | "cl">("br");

  useEffect(() => {
    if (!openGift) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenGift(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openGift]);

  return (
    <Section id="presentes" kicker={t.gifts.kicker} title={t.gifts.title} subtitle={t.gifts.subtitle}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {t.gifts.items.map((gift, index) => {
          const Icon = icons[index % icons.length];
          return (
            <li
              key={gift.title}
              className="flex flex-col rounded-sm border border-terracotta/20 bg-card p-6 text-center"
            >
              <Icon className="mx-auto size-6 text-terracotta" aria-hidden />
              <h3 className="font-display mt-4 text-2xl text-ink">{gift.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{gift.text}</p>
              <button
                type="button"
                onClick={() => setOpenGift(gift.title)}
                className="mx-auto mt-6 min-h-11 rounded-full border border-terracotta/40 px-6 text-xs tracking-[0.2em] text-terracotta uppercase transition-colors hover:bg-terracotta hover:text-primary-foreground"
              >
                {t.gifts.choose}
              </button>
            </li>
          );
        })}
      </ul>

      {openGift && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-ink/50 px-4 py-8 backdrop-blur-sm"
          onClick={() => setOpenGift(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.gifts.modal.title}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full w-full max-w-lg overflow-y-auto rounded-sm border border-terracotta/25 bg-paper p-6 sm:p-8"
          >
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <p className="kicker">{openGift}</p>
                <h3 className="font-display mt-1 text-3xl text-ink">{t.gifts.modal.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.gifts.modal.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenGift(null)}
                aria-label={t.gifts.modal.close}
                className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-full text-ink"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="mt-6 flex gap-2" role="tablist" aria-label={t.gifts.modal.title}>
              {(["br", "cl"] as const).map((key) => (
                <button
                  key={key}
                  role="tab"
                  type="button"
                  aria-selected={tab === key}
                  onClick={() => setTab(key)}
                  className={cn(
                    "min-h-11 flex-1 rounded-full text-xs tracking-[0.2em] uppercase transition-colors",
                    tab === key
                      ? "bg-terracotta text-primary-foreground"
                      : "border border-terracotta/30 text-muted-foreground",
                  )}
                >
                  {key === "br" ? t.gifts.modal.brazil : t.gifts.modal.chile}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {tab === "br" ? (
                <>
                  <CopyField label={t.gifts.modal.pixLabel} value={payment.brazil.pixKey} />
                  <p className="text-center text-sm text-muted-foreground">{t.gifts.modal.pixNote}</p>
                </>
              ) : (
                <>
                  <p className="kicker text-center">{t.gifts.modal.bankTitle}</p>
                  <CopyField label={t.gifts.modal.holder} value={payment.chile.holder} />
                  <CopyField label={t.gifts.modal.rut} value={payment.chile.rut} />
                  <CopyField label={t.gifts.modal.account} value={payment.chile.account} />
                  <CopyField label={t.gifts.modal.email} value={payment.chile.email} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
