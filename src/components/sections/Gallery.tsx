import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Section } from "@/components/Section";
import { photos, THUMB_WIDTH, type Photo } from "@/data/gallery";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

// Inclinação e deslocamento de cada polaroide, para o mural parecer montado à mão.
const layout = [
  "-rotate-2 lg:translate-y-2",
  "rotate-[1.5deg] lg:translate-y-10",
  "-rotate-1 lg:-translate-y-1",
  "rotate-2 lg:translate-y-7",
  "rotate-1 lg:translate-y-1",
  "-rotate-[1.5deg] lg:translate-y-9",
  "rotate-2",
  "-rotate-2 lg:translate-y-6",
];

const tapes = ["bg-peach/70", "bg-leaf/35", "bg-coral/40", "bg-paper-deep"];

function Polaroid({ photo, index, onOpen }: { photo: Photo; index: number; onOpen: () => void }) {
  const { t } = useI18n();
  const copy = t.gallery.photos[photo.id];

  return (
    <li
      className={cn(
        "w-[78%] shrink-0 snap-center transition-transform duration-500 ease-out hover:z-10 hover:rotate-0 sm:w-auto",
        layout[index % layout.length],
      )}
    >
      <figure className="relative rounded-[3px] bg-[#fffdf8] p-3 pb-5 shadow-[0_22px_34px_-22px_rgba(60,38,20,0.55)] ring-1 ring-ink/5">
        <span
          aria-hidden
          className={cn(
            "absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rounded-[2px] shadow-sm",
            index % 2 ? "rotate-3" : "-rotate-3",
            tapes[index % tapes.length],
          )}
        />
        <button
          type="button"
          onClick={onOpen}
          aria-label={`${t.gallery.open}: ${copy.alt}`}
          className="group block w-full overflow-hidden rounded-[2px] bg-paper-deep"
        >
          <img
            src={photo.thumb}
            srcSet={`${photo.thumb} ${THUMB_WIDTH}w, ${photo.src} ${photo.width}w`}
            sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 78vw"
            alt={copy.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            className="aspect-3/4 w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </button>
        <figcaption className="px-1 pt-4 text-center">
          <p className="font-script text-2xl leading-none text-terracotta">{copy.place}</p>
          <p className="font-display mt-2 text-[1.05rem] leading-snug text-ink/85 lining-nums">
            {copy.caption}
          </p>
        </figcaption>
      </figure>
    </li>
  );
}

function Lightbox({
  index,
  onClose,
  onNavigate,
}: {
  index: number;
  onClose: () => void;
  onNavigate: (step: number) => void;
}) {
  const { t } = useI18n();
  const photo = photos[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(-1);
      if (e.key === "ArrowRight") onNavigate(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onNavigate]);

  if (!photo) return null;
  const copy = t.gallery.photos[photo.id];
  const navButton =
    "grid size-12 shrink-0 place-items-center rounded-full border border-paper/30 text-paper transition-colors hover:bg-paper/10";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.gallery.title}
      onClick={onClose}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null || Math.abs(end - start) < 50) return;
        onNavigate(end < start ? 1 : -1);
      }}
      className="fixed inset-0 z-[70] flex flex-col bg-ink/95 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] backdrop-blur-sm"
    >
      <div className="flex items-center justify-between text-paper">
        <p className="text-xs tracking-[0.25em] uppercase" aria-live="polite">
          {t.gallery.counter(index + 1, photos.length)}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t.gallery.close}
          className="grid size-12 place-items-center rounded-full text-paper hover:bg-paper/10"
        >
          <X className="size-6" aria-hidden />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center gap-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(-1);
          }}
          aria-label={t.gallery.previous}
          className={cn(navButton, "hidden sm:grid")}
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>

        <figure onClick={(e) => e.stopPropagation()} className="flex flex-col items-center">
          <img
            key={photo.id}
            src={photo.src}
            alt={copy.alt}
            width={photo.width}
            height={photo.height}
            className="h-auto max-h-[calc(100dvh-18rem)] w-auto max-w-full rounded-[2px] shadow-2xl sm:max-h-[calc(100dvh-13rem)]"
          />
          <figcaption className="max-w-md pt-4 text-center text-paper">
            <p className="font-script text-3xl leading-none text-peach">{copy.place}</p>
            <p className="font-display mt-2 text-lg leading-snug text-paper/90 lining-nums">
              {copy.caption}
            </p>
          </figcaption>
        </figure>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(1);
          }}
          aria-label={t.gallery.next}
          className={cn(navButton, "hidden sm:grid")}
        >
          <ChevronRight className="size-6" aria-hidden />
        </button>
      </div>

      <div className="flex justify-center gap-6 pt-3 sm:hidden">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(-1);
          }}
          aria-label={t.gallery.previous}
          className={navButton}
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(1);
          }}
          aria-label={t.gallery.next}
          className={navButton}
        >
          <ChevronRight className="size-6" aria-hidden />
        </button>
      </div>
    </div>,
    document.body,
  );
}

export function Gallery() {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = (index: number) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setOpenIndex(index);
  };

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  const navigate = useCallback((step: number) => {
    setOpenIndex((current) =>
      current == null ? current : (current + step + photos.length) % photos.length,
    );
  }, []);

  return (
    <Section
      id="memorias"
      kicker={t.gallery.kicker}
      title={t.gallery.title}
      subtitle={t.gallery.subtitle}
    >
      <ul className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pt-6 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 sm:overflow-visible sm:px-2 sm:pb-10 lg:grid-cols-4 lg:gap-x-7">
        {photos.map((photo, index) => (
          <Polaroid key={photo.id} photo={photo} index={index} onOpen={() => open(index)} />
        ))}
      </ul>
      <p
        aria-hidden
        className="mt-1 text-center text-[0.65rem] tracking-[0.25em] text-muted-foreground uppercase sm:hidden"
      >
        {t.gallery.swipeHint}
      </p>

      {openIndex != null && <Lightbox index={openIndex} onClose={close} onNavigate={navigate} />}
    </Section>
  );
}
