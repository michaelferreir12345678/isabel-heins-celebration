import { Camera } from "lucide-react";

import { Section } from "@/components/Section";
import { useI18n } from "@/i18n";

const shapes = [
  "sm:col-span-3 aspect-4/5",
  "sm:col-span-3 aspect-square sm:mt-10",
  "sm:col-span-2 aspect-3/4",
  "sm:col-span-4 aspect-16/10",
  "sm:col-span-4 aspect-16/11 sm:mt-6",
  "sm:col-span-2 aspect-3/4 sm:mt-6",
];

export function Gallery() {
  const { t } = useI18n();

  return (
    <Section id="memorias" kicker={t.gallery.kicker} title={t.gallery.title} subtitle={t.gallery.subtitle}>
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-6">
        {t.gallery.captions.map((caption, index) => (
          <li key={caption} className={shapes[index % shapes.length]}>
            <figure className="group flex size-full flex-col overflow-hidden rounded-sm border border-terracotta/20 bg-paper-deep/50">
              <div className="grid flex-1 place-items-center bg-[radial-gradient(circle_at_30%_25%,color-mix(in_oklab,var(--peach)_45%,transparent),transparent_65%)]">
                <div className="flex flex-col items-center gap-2 text-terracotta/70">
                  <Camera className="size-6" aria-hidden />
                  <span className="text-[0.65rem] tracking-[0.25em] uppercase">
                    {t.gallery.placeholder}
                  </span>
                </div>
              </div>
              <figcaption className="border-t border-terracotta/15 px-4 py-3 text-center font-display text-lg text-ink/80">
                {caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
