import type { ReactNode } from "react";

import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  kicker?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  tone?: "paper" | "deep";
};

export function Section({ id, kicker, title, subtitle, children, className, tone = "paper" }: SectionProps) {
  const reveal = useReveal<HTMLDivElement>();

  return (
    <section
      id={id}
      aria-labelledby={title ? `${id}-title` : undefined}
      className={cn(
        "px-5 py-20 sm:px-8 sm:py-28",
        tone === "deep" ? "bg-paper-deep/60" : "bg-transparent",
        className,
      )}
    >
      <div ref={reveal.ref} className={cn("mx-auto w-full max-w-5xl", reveal.className)}>
        {(kicker || title || subtitle) && (
          <header className="mb-12 text-center sm:mb-16">
            {kicker && <p className="kicker">{kicker}</p>}
            {title && (
              <h2
                id={`${id}-title`}
                className="font-display mt-4 text-4xl leading-tight text-ink sm:text-5xl"
              >
                {title}
              </h2>
            )}
            <span aria-hidden className="mx-auto mt-6 block h-px w-24 bg-terracotta/40" />
            {subtitle && (
              <p className="mx-auto mt-5 max-w-xl text-balance text-base text-muted-foreground">
                {subtitle}
              </p>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
