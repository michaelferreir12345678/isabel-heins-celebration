/**
 * Tipos e regras da confirmação de presença usados pelo site e pelo servidor.
 * Sem imports, para poder ser usado também pelos scripts em scripts/.
 */

export type RsvpMember = {
  /** Identificador do convidado dentro do convite (o nome normalizado). */
  id: string;
  name: string;
  /** Resposta registrada: true = vai, false = não vai, null = ainda não respondeu. */
  attending: boolean | null;
};

export type RsvpInvite = {
  code: string;
  title: string;
  members: RsvpMember[];
  /** Data e hora da última resposta, como aparece na planilha. */
  respondedAt: string | null;
};

export type RsvpAnswer = { memberId: string; attending: boolean };

export type RsvpSubmission = {
  code: string;
  answers: RsvpAnswer[];
  message?: string | undefined;
  lang: "pt" | "es";
};

export type RsvpResult = { ok: true } | { ok: false; reason: "closed" | "not-found" };

export const RSVP_TIME_ZONE = "America/Fortaleza";

export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function memberId(name: string) {
  return normalizeText(name);
}

export function normalizeCode(code: string) {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

const NAME_CONNECTORS = new Set(["da", "das", "de", "del", "do", "dos", "e", "la", "y"]);

/** Palavras de um nome, sem acentos e sem "da", "de", "dos" etc. */
export function nameWords(value: string) {
  return normalizeText(value)
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 0 && !NAME_CONNECTORS.has(word));
}

export function isRsvpClosed(deadline: string, now = Date.now()) {
  return now > new Date(deadline).getTime();
}

/** Dia e nome do mês do prazo, no fuso de Fortaleza. */
export function deadlineParts(deadline: string, locale: string) {
  const date = new Date(deadline);
  const day = Number(
    new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: RSVP_TIME_ZONE }).format(date),
  );
  const month = new Intl.DateTimeFormat(locale, { month: "long", timeZone: RSVP_TIME_ZONE }).format(
    date,
  );
  return { day, month };
}
