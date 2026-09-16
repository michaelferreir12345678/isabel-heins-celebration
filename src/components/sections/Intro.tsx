import { Section } from "@/components/Section";
import { useI18n } from "@/i18n";

export function Intro() {
  const { t } = useI18n();

  return (
    <Section id="intro" kicker={t.intro.kicker} title={t.intro.title}>
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        {t.intro.body.map((paragraph) => (
          <p key={paragraph} className="font-display text-xl leading-relaxed text-ink/85 sm:text-2xl">
            {paragraph}
          </p>
        ))}
        <p className="font-script pt-4 text-3xl text-terracotta">{t.intro.signature}</p>
      </div>
    </Section>
  );
}
