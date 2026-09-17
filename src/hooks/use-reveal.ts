import { useEffect, useRef, useState } from "react";

/** Revela um elemento com uma animação sutil quando ele entra na tela. */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      // Revela assim que o topo passa de 90% da altura da tela. Não usar porcentagem do
      // próprio elemento: seções mais altas que a tela (ex.: presentes no celular, ~5.000 px)
      // nunca chegam a ter 15% visível e ficariam invisíveis.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, className: visible ? "reveal reveal-in" : "reveal" };
}
