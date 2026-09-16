/**
 * Regras da confirmação de presença no servidor: onde os dados ficam,
 * busca por nome, abertura pelo link e gravação das respostas.
 */
import { rsvp as rsvpConfig } from "@/data/site";
import {
  RSVP_TIME_ZONE,
  isRsvpClosed,
  nameWords,
  normalizeCode,
  type RsvpInvite,
  type RsvpResult,
  type RsvpSubmission,
} from "@/lib/rsvp";

import { createDemoStore } from "./demo-guests";
import { sheetsConfigFromEnv } from "./google-sheets.ts";
import { createGuestSheet, type SaveResponseInput } from "./guest-sheet.ts";

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

/** Busca por nome e sobrenome. Palavras soltas não bastam, para proteger a lista. */
export async function searchInvites(query: string): Promise<RsvpInvite[]> {
  const words = nameWords(query);
  if (words.length < 2) return [];
  const invites = await allInvites();
  return invites
    .filter((invite) =>
      invite.members.some((member) => {
        const memberWords = nameWords(member.name);
        return words.every((word) => memberWords.includes(word));
      }),
    )
    .slice(0, 5);
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
