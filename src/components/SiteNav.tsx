import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { LanguageToggle } from "@/components/LanguageToggle";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export function SiteNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#intro", label: t.nav.intro },
    { href: "#historia", label: t.nav.story },
    { href: "#memorias", label: t.nav.gallery },
    { href: "#casamento", label: t.nav.wedding },
    { href: "#presenca", label: t.nav.rsvp },
    { href: "#presentes", label: t.nav.gifts },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled ? "border-b border-terracotta/15 bg-paper/85 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav
        aria-label={t.nav.menu}
        className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3 min-[340px]:gap-4 sm:px-8"
      >
        <a
          href="#topo"
          className="font-script min-w-0 truncate text-[1.15rem] text-ink min-[340px]:text-[1.35rem] min-[400px]:text-2xl sm:text-[1.7rem]"
        >
          Isabel &amp; Heins
        </a>

        <div className="flex shrink-0 items-center gap-2">
          <ul className="hidden items-center gap-6 xl:flex">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[0.78rem] tracking-[0.16em] text-muted-foreground uppercase transition-colors hover:text-terracotta"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <LanguageToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
            className="grid min-h-11 min-w-11 place-items-center rounded-full text-ink xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-terracotta/15 bg-paper/95 xl:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-5 py-2 sm:px-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm tracking-[0.16em] text-ink uppercase"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
