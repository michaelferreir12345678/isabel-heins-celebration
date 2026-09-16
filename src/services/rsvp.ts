import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { findInvite, searchInvites, submitRsvp } from "@/server/rsvp";

/**
 * Funções de servidor da confirmação de presença. O navegador só recebe o convite
 * encontrado; a lista completa e as credenciais do Google ficam no servidor.
 */

const inviteCode = z.string().trim().min(4).max(16);

// Não repassa detalhes técnicos (ex.: respostas do Google) para o navegador.
async function safely<T>(action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    console.error("[confirmação de presença]", error);
    throw new Error("rsvp-unavailable");
  }
}

export const searchInvitesFn = createServerFn({ method: "POST" })
  .validator(z.object({ query: z.string().max(120) }))
  .handler(({ data }) => safely(() => searchInvites(data.query)));

export const getInviteFn = createServerFn({ method: "POST" })
  .validator(z.object({ code: inviteCode }))
  .handler(({ data }) => safely(() => findInvite(data.code)));

export const submitRsvpFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      code: inviteCode,
      answers: z
        .array(z.object({ memberId: z.string().min(1).max(200), attending: z.boolean() }))
        .min(1)
        .max(40),
      message: z.string().trim().max(1000).optional(),
      lang: z.enum(["pt", "es"]),
      // Campo invisível: pessoas deixam vazio, robôs costumam preencher.
      website: z.string().max(0).optional(),
    }),
  )
  .handler(({ data: { website: _honeypot, ...submission } }) =>
    safely(() => submitRsvp(submission)),
  );
