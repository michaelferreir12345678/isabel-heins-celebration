import botanical from "@/assets/botanical-top.png";
import sunset from "@/assets/sunset-bench.jpg";
import paper from "@/assets/paper-texture.jpg";
import { useI18n } from "@/i18n";

export function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="topo"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-40 text-center sm:px-8"
    >
      <img
        src={paper}
        alt=""
        aria-hidden
        width={1536}
        height={1536}
        className="absolute inset-0 -z-20 size-full object-cover opacity-90"
      />
      <img
        src={botanical}
        alt=""
        aria-hidden
        width={1536}
        height={1024}
        className="pointer-events-none absolute -top-6 -right-10 -z-10 w-[62vw] max-w-lg opacity-95 sm:w-[38vw]"
      />

      <p className="kicker">{t.hero.saveTheDate}</p>

      <h1 className="font-display mt-6 text-5xl leading-[0.95] text-ink sm:text-7xl md:text-8xl">
        {t.hero.couple}
      </h1>

      <div className="mt-10 flex flex-col items-center gap-3">
        <p className="font-display text-2xl tracking-[0.22em] text-ink sm:text-3xl">{t.hero.date}</p>
        <span aria-hidden className="h-px w-40 bg-terracotta/40" />
        <p className="text-sm tracking-[0.3em] text-muted-foreground uppercase">{t.hero.place}</p>
      </div>

      <p className="font-script mt-12 text-3xl text-terracotta sm:text-4xl">{t.hero.phrase}</p>

      <img
        src={sunset}
        alt=""
        aria-hidden
        width={1920}
        height={1088}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38vh] w-full object-cover object-bottom [mask-image:linear-gradient(to_bottom,transparent,black_45%)]"
      />

      <a
        href="#intro"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.68rem] tracking-[0.3em] text-ink/70 uppercase"
      >
        {t.hero.scroll}
        <span aria-hidden className="h-10 w-px animate-pulse bg-ink/40" />
      </a>
    </section>
  );
}
