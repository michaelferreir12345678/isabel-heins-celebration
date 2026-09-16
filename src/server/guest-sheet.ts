/**
 * Formato da planilha de convidados e operações sobre ela.
 *
 * Aba "Convidados": uma linha por pessoa. Pessoas do mesmo convite têm o mesmo código.
 * Aba "Respostas": histórico, uma linha por pessoa a cada confirmação enviada.
 *
 * Os imports usam a extensão .ts para este arquivo funcionar também com `node`
 * (scripts/planilha.ts).
 */
import { createSheetsClient, type CellValue, type SheetsConfig } from "./google-sheets.ts";
import { memberId, normalizeText, type RsvpAnswer, type RsvpInvite } from "../lib/rsvp.ts";

export const GUESTS_SHEET = "Convidados";
export const RESPONSES_SHEET = "Respostas";
export const GUEST_HEADERS = [
  "Código",
  "Convite",
  "Nome",
  "Presença",
  "Recado",
  "Respondido em",
  "Link",
];
export const RESPONSE_HEADERS = [
  "Data",
  "Código",
  "Convite",
  "Nome",
  "Presença",
  "Recado",
  "Idioma",
];
export const ATTENDING = "Vai";
export const NOT_ATTENDING = "Não vai";

type GuestRow = {
  /** Número da linha na planilha (a primeira pessoa fica na linha 2). */
  row: number;
  /** Código usado pelo site (o da planilha ou, sem convite, um código individual). */
  code: string;
  /** Se o código já está gravado na coluna Código. */
  storedCode: boolean;
  /** Nome do convite; sem convite preenchido, é o nome da própria pessoa. */
  title: string;
  hasInvite: boolean;
  name: string;
  presence: string;
  respondedAt: string;
  link: string;
};

export type SaveResponseInput = {
  code: string;
  answers: RsvpAnswer[];
  message?: string | undefined;
  lang: string;
  timestamp: string;
};

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 6;

function generateCode(used: Set<string>) {
  for (;;) {
    const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH));
    const code = Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
    if (!used.has(code)) return code;
  }
}

/**
 * Código de quem está sem Convite preenchido: calculado a partir do nome e nunca gravado,
 * para que, ao preencher o Convite depois, a família ganhe um código único.
 * Tem 7 caracteres, então não se confunde com os códigos gerados (6).
 */
function personalCode(name: string) {
  let hash = 0x811c9dc5;
  for (const char of memberId(name)) {
    hash = Math.imul(hash ^ (char.codePointAt(0) ?? 0), 0x01000193) >>> 0;
  }
  let code = "P";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[hash % CODE_ALPHABET.length];
    hash = Math.floor(hash / CODE_ALPHABET.length);
  }
  return code;
}

export function isPersonalCode(code: string) {
  return code.length === CODE_LENGTH + 1 && code.startsWith("P");
}

export function inviteLink(siteUrl: string, code: string) {
  return `${siteUrl.replace(/\/+$/, "")}/?convite=${code}#presenca`;
}

function parsePresence(value: string): boolean | null {
  const normalized = normalizeText(value);
  if (["vai", "sim", "si", "yes", "confirmado"].includes(normalized)) return true;
  if (["nao vai", "nao", "no", "no va"].includes(normalized)) return false;
  return null;
}

function parseRows(values: string[][]): GuestRow[] {
  return values
    .map((cells, index) => {
      const storedCode = (cells[0] ?? "").trim().toUpperCase();
      const invite = (cells[1] ?? "").trim();
      const name = (cells[2] ?? "").trim();
      return {
        row: index + 2,
        code: storedCode || (invite || !name ? "" : personalCode(name)),
        storedCode: Boolean(storedCode),
        title: invite || name,
        hasInvite: Boolean(invite),
        name,
        presence: (cells[3] ?? "").trim(),
        respondedAt: (cells[5] ?? "").trim(),
        link: (cells[6] ?? "").trim(),
      };
    })
    .filter((row) => row.name);
}

function groupInvites(rows: GuestRow[]): RsvpInvite[] {
  const byCode = new Map<string, GuestRow[]>();
  for (const row of rows) {
    if (!row.code) continue;
    byCode.set(row.code, [...(byCode.get(row.code) ?? []), row]);
  }
  return Array.from(byCode, ([code, members]) => ({
    code,
    title: members[0]?.title ?? "",
    members: members.map((member) => ({
      id: memberId(member.name),
      name: member.name,
      attending: parsePresence(member.presence),
    })),
    respondedAt: members.find((member) => member.respondedAt)?.respondedAt ?? null,
  }));
}

export function createGuestSheet(
  config: SheetsConfig,
  options: { siteUrl?: string | undefined } = {},
) {
  const client = createSheetsClient(config);

  async function readRows() {
    return parseRows(await client.getValues(`${GUESTS_SHEET}!A2:G`));
  }

  /** Preenche códigos (um por convite) e links que estiverem faltando. */
  async function fillCodesAndLinks(rows: GuestRow[]) {
    const used = new Set(rows.filter((row) => row.storedCode).map((row) => row.code));
    const codeByTitle = new Map<string, string>();
    for (const row of rows) {
      const key = normalizeText(row.title);
      if (row.hasInvite && row.storedCode && !codeByTitle.has(key)) codeByTitle.set(key, row.code);
    }

    const updates: { range: string; values: CellValue[][] }[] = [];
    for (const row of rows) {
      if (row.hasInvite && !row.storedCode) {
        const key = normalizeText(row.title);
        const code = codeByTitle.get(key) ?? generateCode(used);
        codeByTitle.set(key, code);
        used.add(code);
        row.code = code;
        row.storedCode = true;
        updates.push({ range: `${GUESTS_SHEET}!A${row.row}`, values: [[code]] });
      }
      // Sem código gravado não há link: ele mudaria quando o Convite fosse preenchido.
      if (row.storedCode && options.siteUrl) {
        const link = inviteLink(options.siteUrl, row.code);
        if (row.link !== link) {
          row.link = link;
          updates.push({ range: `${GUESTS_SHEET}!G${row.row}`, values: [[link]] });
        }
      }
    }
    await client.updateValues(updates);
    return updates.length;
  }

  return {
    serviceAccountEmail: client.serviceAccountEmail,

    async loadInvites() {
      const rows = await readRows();
      await fillCodesAndLinks(rows);
      return groupInvites(rows);
    },

    /** Grava a resposta de um convite. Retorna false se o código não existir. */
    async saveResponse({ code, answers, message, lang, timestamp }: SaveResponseInput) {
      // Lê de novo antes de gravar: os noivos podem ter reordenado a planilha.
      const rows = (await readRows()).filter((row) => row.code === code);
      const first = rows[0];
      if (!first) return false;

      const answerById = new Map(answers.map((answer) => [answer.memberId, answer.attending]));
      const updates: { range: string; values: CellValue[][] }[] = [];
      const history: CellValue[][] = [];
      for (const row of rows) {
        const attending = answerById.get(memberId(row.name));
        if (attending === undefined) continue;
        const presence = attending ? ATTENDING : NOT_ATTENDING;
        updates.push(
          { range: `${GUESTS_SHEET}!D${row.row}`, values: [[presence]] },
          { range: `${GUESTS_SHEET}!F${row.row}`, values: [[timestamp]] },
        );
        history.push([
          timestamp,
          code,
          first.title,
          row.name,
          presence,
          history.length === 0 ? (message ?? "") : "",
          lang.toUpperCase(),
        ]);
      }
      if (!history.length) return false;
      // Recado fica na primeira linha do convite; resposta sem recado mantém o anterior.
      if (message) updates.push({ range: `${GUESTS_SHEET}!E${first.row}`, values: [[message]] });

      await client.updateValues(updates);
      await client.appendValues(`${RESPONSES_SHEET}!A:G`, history);
      return true;
    },

    /** Cria as abas, cabeçalhos e a lista suspensa de presença. Pode rodar mais de uma vez. */
    async prepare() {
      const existing = await client.listSheets();
      const missing = [GUESTS_SHEET, RESPONSES_SHEET].filter(
        (title) => !existing.some((sheet) => sheet.title === title),
      );
      await client.batchUpdate(missing.map((title) => ({ addSheet: { properties: { title } } })));

      const sheets = await client.listSheets();
      const guests = sheets.find((sheet) => sheet.title === GUESTS_SHEET);
      const responses = sheets.find((sheet) => sheet.title === RESPONSES_SHEET);
      if (!guests || !responses) throw new Error("Não foi possível criar as abas da planilha.");

      await client.updateValues([
        { range: `${GUESTS_SHEET}!A1:G1`, values: [GUEST_HEADERS] },
        { range: `${RESPONSES_SHEET}!A1:G1`, values: [RESPONSE_HEADERS] },
      ]);

      const headerFormat = (sheetId: number) => [
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true },
                backgroundColor: { red: 0.97, green: 0.93, blue: 0.87 },
              },
            },
            fields: "userEnteredFormat(textFormat,backgroundColor)",
          },
        },
        {
          updateSheetProperties: {
            properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
            fields: "gridProperties.frozenRowCount",
          },
        },
      ];
      const widths = (sheetId: number, pixels: number[]) =>
        pixels.map((pixelSize, index) => ({
          updateDimensionProperties: {
            range: { sheetId, dimension: "COLUMNS", startIndex: index, endIndex: index + 1 },
            properties: { pixelSize },
            fields: "pixelSize",
          },
        }));

      const requests: unknown[] = [
        ...headerFormat(guests.sheetId),
        ...headerFormat(responses.sheetId),
        ...widths(guests.sheetId, [90, 220, 220, 100, 280, 140, 340]),
        ...widths(responses.sheetId, [140, 90, 220, 220, 100, 280, 70]),
        {
          setDataValidation: {
            range: {
              sheetId: guests.sheetId,
              startRowIndex: 1,
              startColumnIndex: 3,
              endColumnIndex: 4,
            },
            rule: {
              condition: {
                type: "ONE_OF_LIST",
                values: [{ userEnteredValue: ATTENDING }, { userEnteredValue: NOT_ATTENDING }],
              },
              showCustomUi: true,
              strict: false,
            },
          },
        },
      ];
      // Cores de presença só na criação, para não duplicar as regras.
      if (missing.includes(GUESTS_SHEET)) {
        for (const [text, color] of [
          [ATTENDING, { red: 0.85, green: 0.93, blue: 0.83 }],
          [NOT_ATTENDING, { red: 0.96, green: 0.84, blue: 0.82 }],
        ] as const) {
          requests.push({
            addConditionalFormatRule: {
              index: 0,
              rule: {
                ranges: [
                  {
                    sheetId: guests.sheetId,
                    startRowIndex: 1,
                    startColumnIndex: 3,
                    endColumnIndex: 4,
                  },
                ],
                booleanRule: {
                  condition: { type: "TEXT_EQ", values: [{ userEnteredValue: text }] },
                  format: { backgroundColor: color },
                },
              },
            },
          });
        }
      }
      await client.batchUpdate(requests);
    },
  };
}

export type GuestSheet = ReturnType<typeof createGuestSheet>;
