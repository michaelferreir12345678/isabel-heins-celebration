import { useI18n } from "@/i18n";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-terracotta/15 bg-paper-deep/60 px-5 py-10 text-center sm:px-8">
      <p className="font-script text-3xl text-ink">{t.footer.couple}</p>
      <p className="mt-2 text-xs tracking-[0.28em] text-muted-foreground uppercase">{t.footer.date}</p>
    </footer>
  );
}
