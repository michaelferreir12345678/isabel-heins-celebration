/**
 * Gera o código "Pix Copia e Cola" (BR Code estático) conforme o Manual de Padrões
 * para Iniciação do Pix do Banco Central. O mesmo texto é usado no QR Code.
 */

type PixPayloadOptions = {
  key: string;
  name: string;
  city: string;
  amount?: number | undefined;
  description?: string | undefined;
  txid?: string;
};

function field(id: string, value: string) {
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

// Os apps dos bancos esperam apenas caracteres ASCII simples nos campos de texto.
function sanitize(value: string, maxLength: number) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)
    .trim();
}

// CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF).
function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function buildPixPayload({
  key,
  name,
  city,
  amount,
  description,
  txid = "***",
}: PixPayloadOptions) {
  // O campo 26 comporta até 99 caracteres: GUI (18) + chave (4 + n) + descrição (4 + n).
  const info = description ? sanitize(description, 99 - 18 - 4 - key.length - 4) : "";
  const account =
    field("00", "br.gov.bcb.pix") + field("01", key) + (info ? field("02", info) : "");

  const payload =
    field("00", "01") +
    field("26", account) +
    field("52", "0000") +
    field("53", "986") +
    (amount ? field("54", amount.toFixed(2)) : "") +
    field("58", "BR") +
    field("59", sanitize(name, 25)) +
    field("60", sanitize(city, 15)) +
    field("62", field("05", txid)) +
    "6304";

  return payload + crc16(payload);
}
