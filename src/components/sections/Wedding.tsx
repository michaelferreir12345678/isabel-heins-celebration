import { CalendarHeart, MapPin, Shirt } from "lucide-react";

import { Section } from "@/components/Section";
import { event } from "@/data/site";
import { useI18n } from "@/i18n";

export function Wedding() {
  const { t } = useI18n();

  const cards = [
    {
      icon: CalendarHeart,
      label: t.wedding.dateLabel,
      value: t.wedding.dateValue,
      note: undefined as string | undefined,
    },
    {
      icon: MapPin,
      label: t.wedding.venueLabel,
      value: t.wedding.venueName,
      note: t.wedding.venueAddress,
    },
    {
      icon: Shirt,
      label: t.wedding.dressLabel,
      value: t.wedding.dressValue,
      note: t.wedding.dressNote,
    },
  ];

  return (
    <Section
      id="casamento"
      tone="deep"
      kicker={t.wedding.kicker}
      title={t.wedding.title}
      subtitle={t.wedding.subtitle}
    >
      <ul className="grid gap-5 sm:grid-cols-3">
        {cards.map(({ icon: Icon, label, value, note }) => (
          <li
            key={label}
            className="flex flex-col items-center rounded-sm border border-terracotta/20 bg-card px-6 py-9 text-center"
          >
            <Icon className="size-6 text-terracotta" aria-hidden />
            <p className="kicker mt-4">{label}</p>
            <p className="font-display mt-3 text-2xl text-ink">{value}</p>
            {note && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{note}</p>}
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <a
          href={event.mapsUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-terracotta px-7 text-sm tracking-[0.18em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
        >
          <MapPin className="size-4" aria-hidden />
          {t.wedding.maps}
        </a>
      </div>
    </Section>
  );
}
