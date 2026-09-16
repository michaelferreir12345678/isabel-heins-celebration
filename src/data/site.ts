/** Dados configuráveis do casamento. Edite aqui para atualizar o site. */

export const event = {
  coupleShort: "Isabel & Heins",
  isoDate: "2026-11-01T16:00:00-03:00",
  venueName: "Buffet Le Jardin",
  venueAddress: "Rua General Castelo Branco, 88, Cidade dos Funcionários, Fortaleza - CE",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("Buffet Le Jardin, Rua General Castelo Branco, 88, Cidade dos Funcionários, Fortaleza - CE"),
} as const;

export const payment = {
  brazil: {
    pixKey: "06321365378",
  },
  chile: {
    bank: "Santander",
    holder: "Heins Hanson Powell",
    rut: "18.022.767-9",
    account: "9425377 2",
    email: "heins.powell@gmail.com",
  },
} as const;

/** Ícones simbólicos (nomes de ícones lucide) para cada card de presente. */
export const giftIcons = ["Wine", "Coffee", "Plane", "Home", "Stars", "Heart"] as const;
