import type { SVGProps } from "react";

// Bandeiras simplificadas para o seletor de idioma (emojis de bandeira não aparecem no Windows).

export function FlagBR(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 14" aria-hidden {...props}>
      <rect width="20" height="14" fill="#009b3a" />
      <polygon points="10,1.7 18.3,7 10,12.3 1.7,7" fill="#fedf00" />
      <circle cx="10" cy="7" r="3.4" fill="#002776" />
      <path d="M6.9 6.1c2.2-.55 4.55-.1 6.35 1.5" stroke="#fff" strokeWidth=".7" fill="none" />
    </svg>
  );
}

export function FlagCL(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 21 14" aria-hidden {...props}>
      <rect width="21" height="14" fill="#fff" />
      <rect y="7" width="21" height="7" fill="#d52b1e" />
      <rect width="7" height="7" fill="#0039a6" />
      <polygon
        points="3.50,1.55 3.94,2.90 5.35,2.90 4.21,3.73 4.65,5.08 3.50,4.24 2.35,5.08 2.79,3.73 1.65,2.90 3.06,2.90"
        fill="#fff"
      />
    </svg>
  );
}
