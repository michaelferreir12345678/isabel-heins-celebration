import { Section } from "@/components/Section";
import { useI18n } from "@/i18n";

export function Story() {
  const { t } = useI18n();

  return (
    <Section
      id="historia"
      tone="deep"
      kicker={t.story.kicker}
      title={t.story.title}
      subtitle={t.story.subtitle}
    >
      <ol className="relative mx-auto max-w-3xl border-l border-terracotta/25 pl-6 sm:pl-10">
        {t.story.items.map((item) => (
          <li key={item.year} className="relative pb-14 last:pb-0">
            <span
              aria-hidden
              className="absolute top-2 -left-[1.6rem] size-2.5 rounded-full bg-terracotta sm:-left-[2.85rem]"
            />
            <p className="kicker">{item.tag}</p>
            <p className="font-display mt-2 text-2xl text-terracotta sm:text-3xl">{item.year}</p>
            <h3 className="font-script mt-1 text-3xl text-ink">{item.title}</h3>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
