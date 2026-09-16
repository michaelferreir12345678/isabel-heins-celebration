import botanical from "@/assets/botanical-top.png";
import sunset from "@/assets/sunset-bench.jpg";
import paper from "@/assets/paper-texture.jpg";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n";

export function Hero() {
  const { t } = useI18n();

  return (
    <section
      id="topo"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pt-24 pb-[calc(var(--art)+1.5rem)] text-center [--art:38vh] sm:px-8 sm:pt-28 short:pt-20 compact:[--art:32vh]"
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

      <nav aria-label={t.nav.menu} className="mb-5 flex flex-wrap justify-center gap-2.5">
        <Button
          asChild
          variant="outline"
          className="h-11 rounded-full border-terracotta/40 bg-paper/70 px-5 text-xs tracking-[0.12em] text-terracotta uppercase shadow-none backdrop-blur-sm hover:bg-terracotta hover:text-primary-foreground"
        >
          <a href="#presentes">{t.hero.giftsAction}</a>
        </Button>
        <Button
          asChild
          className="h-11 rounded-full bg-terracotta px-5 text-xs tracking-[0.12em] text-primary-foreground uppercase shadow-none hover:bg-terracotta/90"
        >
          <a href="#presenca">{t.hero.rsvpAction}</a>
        </Button>
      </nav>

      <p className="kicker">{t.hero.saveTheDate}</p>

      <h1 className="font-display mt-6 text-5xl leading-[0.95] text-ink sm:text-7xl md:text-8xl">
        {t.hero.couple}
      </h1>

      <div className="mt-10 flex flex-col items-center gap-3 short:mt-6">
        <p className="font-display text-2xl tracking-[0.22em] text-ink sm:text-3xl">
          {t.hero.date}
        </p>
        <span aria-hidden className="h-px w-40 bg-terracotta/40" />
        <p className="text-sm tracking-[0.3em] text-muted-foreground uppercase">{t.hero.place}</p>
      </div>

      <p className="font-script text-halo mt-12 text-3xl text-terracotta sm:text-4xl short:mt-7">
        {t.hero.phrase}
      </p>

      <a
        href="#intro"
        className="mt-10 hidden flex-col items-center gap-2 text-[0.68rem] tracking-[0.3em] text-ink/70 uppercase tall:flex"
      >
        {t.hero.scroll}
        <span aria-hidden className="h-8 w-px animate-pulse bg-ink/40" />
      </a>

      <img
        src={sunset}
        alt=""
        aria-hidden
        width={1920}
        height={1088}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-(--art) w-full object-cover object-bottom [mask-image:linear-gradient(to_bottom,transparent,black_45%)]"
      />
    </section>
  );
}
