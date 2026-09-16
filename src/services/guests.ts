import { invites, type Invite } from "@/data/guests";

export type RsvpMemberAnswer = {
  memberId: string;
  name: string;
  attending: boolean;
};

export type RsvpSubmission = {
  inviteId: string;
  inviteTitle: string;
  answers: RsvpMemberAnswer[];
  message?: string;
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Busca convites pelo nome de um convidado ou pelo nome do convite.
 * Camada de serviço isolada: troque o corpo por uma chamada ao
 * Google Sheets ou ao Lovable Cloud mantendo a mesma assinatura.
 */
export async function searchInvites(query: string): Promise<Invite[]> {
  await delay(500);
  const q = normalize(query);
  if (q.length < 2) return [];
  return invites.filter(
    (invite) =>
      normalize(invite.title).includes(q) ||
      invite.members.some((member) => normalize(member.name).includes(q)),
  );
}

export async function submitRsvp(submission: RsvpSubmission): Promise<{ ok: true }> {
  await delay(700);
  // eslint-disable-next-line no-console
  console.info("RSVP recebido", submission);
  return { ok: true };
}
