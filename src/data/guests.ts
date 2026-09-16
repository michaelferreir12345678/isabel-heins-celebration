export type InviteMember = {
  id: string;
  name: string;
};

export type Invite = {
  id: string;
  /** Nome do convite exibido, ex.: "Família Oliveira" */
  title: string;
  members: InviteMember[];
};

/**
 * Lista simulada de convites. Substitua por Google Sheets / Supabase
 * mantendo o mesmo formato — a interface não precisa mudar.
 */
export const invites: Invite[] = [
  {
    id: "inv-001",
    title: "Família Oliveira",
    members: [
      { id: "m-001", name: "Maria Oliveira" },
      { id: "m-002", name: "João Oliveira" },
      { id: "m-003", name: "Laura Oliveira" },
    ],
  },
  {
    id: "inv-002",
    title: "Família Powell",
    members: [
      { id: "m-004", name: "Carolina Powell" },
      { id: "m-005", name: "Andrés Powell" },
    ],
  },
  {
    id: "inv-003",
    title: "Família Hanson",
    members: [
      { id: "m-006", name: "Patricia Hanson" },
      { id: "m-007", name: "Felipe Hanson" },
      { id: "m-008", name: "Emilia Hanson" },
      { id: "m-009", name: "Tomás Hanson" },
    ],
  },
  {
    id: "inv-004",
    title: "Ana Beatriz Lima e acompanhante",
    members: [
      { id: "m-010", name: "Ana Beatriz Lima" },
      { id: "m-011", name: "Acompanhante" },
    ],
  },
  {
    id: "inv-005",
    title: "Familia Rojas Contreras",
    members: [
      { id: "m-012", name: "Javiera Rojas" },
      { id: "m-013", name: "Matías Contreras" },
    ],
  },
  {
    id: "inv-006",
    title: "Família Souza",
    members: [
      { id: "m-014", name: "Michael Ferreira de Sousa" },
      { id: "m-015", name: "Convidado(a)" },
    ],
  },
];
