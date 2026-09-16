/**
 * Convidados de exemplo para testar a confirmação localmente, sem planilha.
 * Só é usado fora de produção, quando as variáveis do Google não estão configuradas.
 * Links de teste: http://localhost:8080/?convite=DEMO01#presenca (DEMO01 a DEMO06).
 */
import { memberId, type RsvpInvite } from "@/lib/rsvp";

import type { SaveResponseInput } from "./guest-sheet.ts";

const sample: { title: string; names: string[] }[] = [
  { title: "Família Oliveira", names: ["Maria Oliveira", "João Oliveira", "Laura Oliveira"] },
  { title: "Família Powell", names: ["Carolina Powell", "Andrés Powell"] },
  {
    title: "Família Hanson",
    names: ["Patricia Hanson", "Felipe Hanson", "Emilia Hanson", "Tomás Hanson"],
  },
  { title: "Ana Beatriz Lima e acompanhante", names: ["Ana Beatriz Lima", "Acompanhante de Ana"] },
  { title: "Familia Rojas Contreras", names: ["Javiera Rojas", "Matías Contreras"] },
  { title: "Família Souza", names: ["Michael Ferreira de Sousa", "Convidado(a) de Michael"] },
];

export function createDemoStore() {
  const invites: RsvpInvite[] = sample.map(({ title, names }, index) => ({
    code: `DEMO0${index + 1}`,
    title,
    members: names.map((name) => ({ id: memberId(name), name, attending: null })),
    respondedAt: null,
  }));

  return {
    async loadInvites() {
      return structuredClone(invites);
    },

    async saveResponse({ code, answers, message, timestamp }: SaveResponseInput) {
      const invite = invites.find((item) => item.code === code);
      if (!invite) return false;
      for (const answer of answers) {
        const member = invite.members.find((item) => item.id === answer.memberId);
        if (member) member.attending = answer.attending;
      }
      invite.respondedAt = timestamp;
      console.info("[confirmação de presença, modo demonstração]", {
        convite: invite.title,
        respostas: invite.members.map((member) => `${member.name}: ${member.attending}`),
        recado: message,
      });
      return true;
    },
  };
}
