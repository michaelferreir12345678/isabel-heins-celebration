const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const brlWithCents = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const clp = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });

export function formatBRL(value: number, { cents = false } = {}) {
  return (cents ? brlWithCents : brl).format(value);
}

// "CLP" em vez de "$" para não confundir com dólar do lado brasileiro.
export function formatCLP(value: number) {
  return `CLP ${clp.format(value)}`;
}
