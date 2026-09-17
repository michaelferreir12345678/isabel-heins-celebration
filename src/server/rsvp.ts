/**
 * Regras da confirmação de presença no servidor: onde os dados ficam,
 * busca por nome, abertura pelo link e gravação das respostas.
 */
import { rsvp as rsvpConfig } from "@/data/site";
import {
  RSVP_TIME_ZONE,
  hasEnoughLetters,
  isRsvpClosed,
  nameWords,
  normalizeCode,
  type RsvpInvite,
  type RsvpResult,
  type RsvpSubmission,
  type RsvpSuggestion,
} from "@/lib/rsvp";

import { createDemoStore } from "./demo-guests";
import { sheetsConfigFromEnv } from "./google-sheets.ts";
import { createGuestSheet, type SaveResponseInput } from "./guest-sheet.ts";
import { nameMatchScore, suggestionScore } from "./name-match.ts";

type Store = {
  loadInvites(): Promise<RsvpInvite[]>;
  saveResponse(input: SaveResponseInput): Promise<boolean>;
};

let store: Store | undefined;

function siteUrl() {
  const env = process.env;
  if (env["SITE_URL"]) return env["SITE_URL"];
  if (env["VERCEL_PROJECT_PRODUCTION_URL"])
    return `https://${env["VERCEL_PROJECT_PRODUCTION_URL"]}`;
  return undefined;
}

function getStore(): Store {
  if (store) return store;
  const config = sheetsConfigFromEnv(process.env);
  if (config) {
    store = createGuestSheet(config, { siteUrl: siteUrl() });
  } else if (process.env["NODE_ENV"] !== "production") {
    console.warn(
      "[confirmação de presença] Google Planilhas não configurado; usando convidados de demonstração.",
    );
    store = createDemoStore();
  } else {
    throw new Error(
      "Confirmação de presença sem configuração: defina GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL e GOOGLE_PRIVATE_KEY.",
    );
  }
  return store;
}

// A lista muda pouco; guardar por alguns segundos poupa chamadas ao Google a cada busca.
const CACHE_MS = 30_000;
let cache: { invites: RsvpInvite[]; loadedAt: number } | undefined;

async function allInvites() {
  if (cache && Date.now() - cache.loadedAt < CACHE_MS) return cache.invites;
  const invites = await getStore().loadInvites();
  cache = { invites, loadedAt: Date.now() };
  return invites;
}

const MAX_RESULTS = 5;

/**
 * Convidados que combinam com o que foi digitado, do mais parecido para o menos.
 * Vale o começo das palavras ("bea fir") e o nome completo com pequenos erros
 * (regras em name-match.ts).
 */
async function rankGuests(query: string) {
  if (!hasEnoughLetters(query)) return [];
  const words = nameWords(query);
  const matches: { score: number; suggestion: RsvpSuggestion }[] = [];
  for (const invite of await allInvites()) {
    for (const member of invite.members) {
      const memberWords = nameWords(member.name);
      const score = Math.max(
        suggestionScore(words, memberWords),
        nameMatchScore(words, memberWords),
      );
      if (score > 0) matches.push({ score, suggestion: { name: member.name, invite } });
    }
  }
  return matches
    .sort(
      (a, b) => b.score - a.score || a.suggestion.name.localeCompare(b.suggestion.name, "pt-BR"),
    )
    .map(({ suggestion }) => suggestion);
}

/** Nomes para a lista suspensa enquanto a pessoa digita. */
export async function suggestGuests(query: string): Promise<RsvpSuggestion[]> {
  return (await rankGuests(query)).slice(0, MAX_RESULTS);
}

/** Convites encontrados ao apertar "Buscar". */
export async function searchInvites(query: string): Promise<RsvpInvite[]> {
  const invites = new Map<string, RsvpInvite>();
  for (const { invite } of await rankGuests(query)) {
    if (!invites.has(invite.code)) invites.set(invite.code, invite);
    if (invites.size === MAX_RESULTS) break;
  }
  return [...invites.values()];
}

export async function findInvite(code: string): Promise<RsvpInvite | null> {
  const normalized = normalizeCode(code);
  const invites = await allInvites();
  return invites.find((invite) => invite.code === normalized) ?? null;
}

const timestampFormat = new Intl.DateTimeFormat("pt-BR", {
  timeZone: RSVP_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export async function submitRsvp(submission: RsvpSubmission): Promise<RsvpResult> {
  if (isRsvpClosed(rsvpConfig.deadline)) return { ok: false, reason: "closed" };
  const saved = await getStore().saveResponse({
    ...submission,
    code: normalizeCode(submission.code),
    timestamp: timestampFormat.format(new Date()).replace(",", ""),
  });
  cache = undefined;
  return saved ? { ok: true } : { ok: false, reason: "not-found" };
}
