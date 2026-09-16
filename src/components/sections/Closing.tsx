import sunset from "@/assets/sunset-bench.jpg";
import { useI18n } from "@/i18n";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

export function Closing() {
  const { t } = useI18n();
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section className="relative isolate overflow-hidden px-5 pt-24 pb-52 text-center sm:px-8">
      <img
        src={sunset}
        alt=""
        aria-hidden
        loading="lazy"
        width={1920}
        height={1088}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46vh] w-full object-cover object-bottom [mask-image:linear-gradient(to_bottom,transparent,black_40%)]"
      />
      <div ref={reveal.ref} className={cn("mx-auto max-w-2xl", reveal.className)}>
        <h2 className="font-display text-4xl text-ink sm:text-5xl">{t.closing.title}</h2>
        <span aria-hidden className="mx-auto mt-6 block h-px w-24 bg-terracotta/40" />
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{t.closing.body}</p>
        <p className="font-script mt-8 text-3xl text-terracotta">{t.closing.signature}</p>
      </div>
    </section>
  );
}
