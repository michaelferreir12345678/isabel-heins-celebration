import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Gift as GiftIcon, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Section } from "@/components/Section";
import { SantanderLogo } from "@/components/SantanderLogo";
import { gifts, type GiftId } from "@/data/gifts";
import { payment } from "@/data/site";
import { useI18n } from "@/i18n";
import { formatBRL, formatCLP } from "@/lib/currency";
import { buildPixPayload } from "@/lib/pix";
import { cn } from "@/lib/utils";

type Selection = GiftId | "free";

function useCopy() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return { copied, copy };
}

function CopyField({
  label,
  value,
  copyValue = value,
  truncate = false,
}: {
  label: string;
  value: string;
  copyValue?: string;
  truncate?: boolean;
}) {
  const { t } = useI18n();
  const { copied, copy } = useCopy();

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-sm border border-terracotta/20 bg-paper/70 px-4 py-3">
      <div className="min-w-0">
        <p className="kicker">{label}</p>
        <p
          className={cn(
            "mt-1 font-display text-lg text-ink lining-nums",
            truncate ? "truncate" : "break-words",
          )}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={() => copy(copyValue)}
        className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border border-terracotta/40 px-4 text-xs tracking-[0.14em] text-terracotta uppercase"
      >
        {copied ? (
          <Check className="size-3.5" aria-hidden />
        ) : (
          <Copy className="size-3.5" aria-hidden />
        )}
        {copied ? t.gifts.modal.copied : t.gifts.modal.copy}
      </button>
    </div>
  );
}

function PixPanel({ description, amount }: { description: string; amount?: number | undefined }) {
  const { t } = useI18n();
  const m = t.gifts.modal;
  const { brazil } = payment;
  const code = useMemo(
    () =>
      buildPixPayload({
        key: brazil.pixKey,
        name: brazil.receiverName,
        city: brazil.city,
        amount,
        description,
      }),
    [brazil, amount, description],
  );

  return (
    <div className="space-y-3">
      <div className="rounded-sm border border-terracotta/20 bg-card px-5 py-6 text-center">
        <div className="mx-auto w-fit rounded-md bg-white p-3 shadow-[0_10px_30px_-18px_rgba(36,30,25,0.6)]">
          <QRCodeSVG
            value={code}
            size={192}
            level="M"
            marginSize={0}
            fgColor="#241e19"
            bgColor="#ffffff"
            title={m.pixCopyPaste}
          />
        </div>
        <p className="kicker mt-5">{amount ? m.amount : m.freeAmount}</p>
        {amount ? (
          <p className="font-display mt-1 text-4xl text-ink lining-nums">
            {formatBRL(amount, { cents: true })}
          </p>
        ) : null}
        <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">{m.pixScan}</p>
      </div>
      <CopyField label={m.pixCopyPaste} value={code} truncate />
      <CopyField label={m.pixLabel} value={brazil.pixKey} />
      <p className="text-center text-sm text-muted-foreground">{m.pixNote}</p>
    </div>
  );
}

function SantanderPanel({ amount }: { amount?: number | undefined }) {
  const { t } = useI18n();
  const m = t.gifts.modal;
  const { chile } = payment;
  const { copied, copy } = useCopy();
  const accountDigits = chile.account.replace(/\D/g, "");

  const summary = [
    `${m.holder}: ${chile.holder}`,
    `${m.rut}: ${chile.rut}`,
    `${m.bank}: ${chile.bank}`,
    `${m.accountTypeLabel}: ${m.accountType}`,
    `${m.account}: ${accountDigits}`,
    `${m.email}: ${chile.email}`,
    ...(amount ? [`${m.amount}: ${formatCLP(amount)}`] : []),
  ].join("\n");

  return (
    <div className="space-y-3">
      <div
        role="img"
        aria-label={`${chile.bank}, ${m.accountType} ${chile.account}`}
        className="relative isolate flex aspect-[1.586/1] flex-col justify-between gap-4 rounded-xl bg-linear-to-br from-[#ff2a2a] via-[#e30000] to-[#990000] p-5 text-white shadow-[0_22px_40px_-22px_rgba(153,0,0,0.9)] sm:p-6"
      >
        <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden rounded-xl">
          <span className="absolute -top-20 -right-12 size-56 rounded-full bg-white/10" />
          <span className="absolute -bottom-28 -left-16 size-64 rounded-full bg-black/10" />
        </div>
        <div className="flex items-start justify-between gap-3">
          <SantanderLogo className="h-6 w-auto sm:h-7" aria-hidden />
          <span className="pt-1 text-right text-[0.62rem] tracking-[0.22em] text-white/80 uppercase">
            {m.accountType}
          </span>
        </div>
        <div>
          <span
            aria-hidden
            className="block h-6 w-9 rounded-[5px] bg-linear-to-br from-[#f7e7b0] via-[#d9b865] to-[#b08a36]"
          />
          <p className="mt-3 font-mono text-xl tracking-[0.2em] sm:text-2xl">{chile.account}</p>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[0.58rem] tracking-[0.22em] text-white/70 uppercase">{m.holder}</p>
            <p className="text-[0.8rem] leading-tight font-medium tracking-wide uppercase sm:text-sm">
              {chile.holder}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[0.58rem] tracking-[0.22em] text-white/70 uppercase">{m.rut}</p>
            <p className="text-[0.8rem] leading-tight font-medium tracking-wide sm:text-sm">
              {chile.rut}
            </p>
          </div>
        </div>
      </div>

      <p className="pt-1 text-center text-sm text-muted-foreground">
        {amount ? (
          <>
            {m.suggested}: <strong className="font-medium text-ink">{formatCLP(amount)}</strong>
          </>
        ) : (
          m.freeAmount
        )}
      </p>

      <CopyField label={m.holder} value={chile.holder} />
      <CopyField label={m.rut} value={chile.rut} />
      <CopyField label={m.account} value={chile.account} copyValue={accountDigits} />
      <CopyField label={m.email} value={chile.email} />

      <button
        type="button"
        onClick={() => copy(summary)}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#e30000] px-6 text-xs tracking-[0.2em] text-white uppercase transition-colors hover:bg-[#b80000]"
      >
        {copied ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Copy className="size-4" aria-hidden />
        )}
        {copied ? m.copied : m.copyAll}
      </button>
      <p className="text-center text-sm text-muted-foreground">{m.transferNote}</p>
    </div>
  );
}

export function Gifts() {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState<Selection | null>(null);
  const [tab, setTab] = useState<"br" | "cl">("br");

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  function open(selection: Selection) {
    setTab(lang === "es" ? "cl" : "br");
    setSelected(selection);
  }

  const gift = gifts.find((item) => item.id === selected);
  const selectedTitle = gift ? t.gifts.items[gift.id].title : t.gifts.free.title;
  const primaryPrice = (brl: number, clp: number) =>
    lang === "es" ? formatCLP(clp) : formatBRL(brl);
  const secondaryPrice = (brl: number, clp: number) =>
    lang === "es" ? formatBRL(brl) : formatCLP(clp);

  return (
    <Section
      id="presentes"
      kicker={t.gifts.kicker}
      title={t.gifts.title}
      subtitle={t.gifts.subtitle}
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {gifts.map((item) => {
          const Icon = item.icon;
          const copy = t.gifts.items[item.id];
          return (
            <li
              key={item.id}
              className="flex flex-col rounded-sm border border-terracotta/20 bg-card p-6 text-center"
            >
              <Icon className="mx-auto size-6 text-terracotta" aria-hidden />
              <h3 className="font-display mt-4 text-2xl text-ink">{copy.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {copy.text}
              </p>
              <p className="font-display mt-5 text-3xl text-terracotta">
                {primaryPrice(item.brl, item.clp)}
              </p>
              <p className="mt-1 text-xs tracking-[0.12em] text-muted-foreground">
                <span className="sr-only">{t.gifts.approx} </span>
                <span aria-hidden>≈ </span>
                {secondaryPrice(item.brl, item.clp)}
              </p>
              <button
                type="button"
                onClick={() => open(item.id)}
                className="mx-auto mt-5 min-h-11 rounded-full border border-terracotta/40 px-6 text-xs tracking-[0.2em] text-terracotta uppercase transition-colors hover:bg-terracotta hover:text-primary-foreground"
              >
                {t.gifts.choose}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mx-auto mt-8 max-w-xl rounded-sm border border-dashed border-terracotta/40 px-6 py-8 text-center">
        <GiftIcon className="mx-auto size-6 text-terracotta" aria-hidden />
        <h3 className="font-display mt-3 text-2xl text-ink">{t.gifts.free.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.gifts.free.text}</p>
        <button
          type="button"
          onClick={() => open("free")}
          className="mx-auto mt-5 min-h-11 rounded-full bg-terracotta px-6 text-xs tracking-[0.2em] text-primary-foreground uppercase transition-colors hover:bg-terracotta/90"
        >
          {t.gifts.free.action}
        </button>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center bg-ink/50 px-4 py-8 backdrop-blur-sm"
          onClick={() => setSelected(null)}
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
                <p className="kicker">{selectedTitle}</p>
                <h3 className="font-display mt-1 text-3xl text-ink">{t.gifts.modal.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.gifts.modal.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
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
                    "min-h-11 flex-1 rounded-full px-2 text-[0.68rem] tracking-[0.14em] uppercase transition-colors sm:text-xs",
                    tab === key
                      ? "bg-terracotta text-primary-foreground"
                      : "border border-terracotta/30 text-muted-foreground",
                  )}
                >
                  {key === "br" ? t.gifts.modal.brazil : t.gifts.modal.chile}
                </button>
              ))}
            </div>

            <div className="mt-6" role="tabpanel">
              {tab === "br" ? (
                <PixPanel description={selectedTitle} amount={gift?.brl} />
              ) : (
                <SantanderPanel amount={gift?.clp} />
              )}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
