import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteNav } from "@/components/SiteNav";
import { Closing } from "@/components/sections/Closing";
import { Gallery } from "@/components/sections/Gallery";
import { Gifts } from "@/components/sections/Gifts";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Rsvp } from "@/components/sections/Rsvp";
import { Story } from "@/components/sections/Story";
import { Wedding } from "@/components/sections/Wedding";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Isabel & Heins | Casamento em Fortaleza" },
      { name: "description", content: "Site oficial do casamento de Isabel e Heins, dia 01 de novembro de 2026, em Fortaleza, Ceará." },
      { property: "og:title", content: "Isabel & Heins | 01.11.2026" },
      { property: "og:description", content: "Vamos celebrar o amor em Fortaleza, Ceará." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          name: "Casamento de Isabel e Heins",
          startDate: "2026-11-01T16:00:00-03:00",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          location: {
            "@type": "Place",
            name: "Buffet Le Jardin",
            address: "Rua General Castelo Branco, 88, Cidade dos Funcionários, Fortaleza - CE",
          },
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="paper-grain min-h-screen overflow-x-hidden">
      <SiteNav />
      <main>
        <Hero />
        <Intro />
        <Story />
        <Gallery />
        <Wedding />
        <Rsvp />
        <Gifts />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
