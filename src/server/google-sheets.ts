/**
 * Acesso mínimo à API do Google Planilhas usando uma conta de serviço.
 * Não depende de bibliotecas: o token de acesso é assinado com WebCrypto,
 * que existe tanto no Node quanto na Vercel.
 *
 * Este arquivo não importa nada do projeto para poder ser usado também pelos
 * scripts em scripts/ (rodados direto com `node`).
 */

export type SheetsConfig = {
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
};

export type CellValue = string | number | boolean;

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API_URL = "https://sheets.googleapis.com/v4/spreadsheets";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

export function sheetsConfigFromEnv(env: Record<string, string | undefined>): SheetsConfig | null {
  const spreadsheetId = env["GOOGLE_SHEETS_ID"]?.trim();
  const clientEmail = env["GOOGLE_SERVICE_ACCOUNT_EMAIL"]?.trim();
  const privateKey = env["GOOGLE_PRIVATE_KEY"]?.trim();
  if (!spreadsheetId || !clientEmail || !privateKey) return null;
  return { spreadsheetId, clientEmail, privateKey };
}

function base64url(input: ArrayBuffer | string) {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function importPrivateKey(pem: string) {
  // Na Vercel a chave costuma chegar com "\n" literais no lugar das quebras de linha.
  const body = pem
    .replace(/\\n/g, "\n")
    .replace(/-----(BEGIN|END) PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const der = Uint8Array.from(atob(body), (char) => char.charCodeAt(0));
  return crypto.subtle.importKey(
    "pkcs8",
    der,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

const tokenCache = new Map<string, { value: string; expiresAt: number }>();

async function getAccessToken(config: SheetsConfig) {
  const cached = tokenCache.get(config.clientEmail);
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.value;

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: config.clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const key = await importPrivateKey(config.privateKey);
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(`${header}.${claims}`),
  );

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${base64url(signature)}`,
    }),
  });
  if (!response.ok) {
    throw new Error(`Falha ao autenticar no Google (${response.status}): ${await response.text()}`);
  }
  const data = (await response.json()) as { access_token: string; expires_in: number };
  tokenCache.set(config.clientEmail, {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  });
  return data.access_token;
}

async function request<T>(config: SheetsConfig, path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken(config);
  const response = await fetch(`${API_URL}/${config.spreadsheetId}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    throw new Error(`Google Planilhas respondeu ${response.status}: ${await response.text()}`);
  }
  return (await response.json()) as T;
}

/**
 * `input` define como o Google interpreta os valores:
 * - "RAW" grava o texto como está (use para tudo que vem dos convidados, evita fórmulas maliciosas);
 * - "USER_ENTERED" interpreta como se alguém tivesse digitado (fórmulas, datas).
 */
type ValueInput = "RAW" | "USER_ENTERED";

export function createSheetsClient(config: SheetsConfig) {
  return {
    serviceAccountEmail: config.clientEmail,

    async listSheets() {
      const data = await request<{ sheets?: { properties: { sheetId: number; title: string } }[] }>(
        config,
        "?fields=sheets.properties(sheetId,title)",
      );
      return (data.sheets ?? []).map((sheet) => sheet.properties);
    },

    async getValues(range: string): Promise<string[][]> {
      const data = await request<{ values?: string[][] }>(
        config,
        `/values/${encodeURIComponent(range)}?valueRenderOption=FORMATTED_VALUE`,
      );
      return data.values ?? [];
    },

    async updateValues(
      data: { range: string; values: CellValue[][] }[],
      input: ValueInput = "RAW",
    ) {
      if (!data.length) return;
      await request(config, "/values:batchUpdate", {
        method: "POST",
        body: JSON.stringify({ valueInputOption: input, data }),
      });
    },

    async appendValues(range: string, values: CellValue[][], input: ValueInput = "RAW") {
      if (!values.length) return;
      await request(
        config,
        `/values/${encodeURIComponent(range)}:append?valueInputOption=${input}&insertDataOption=INSERT_ROWS`,
        { method: "POST", body: JSON.stringify({ values }) },
      );
    },

    async batchUpdate(requests: unknown[]) {
      if (!requests.length) return;
      await request(config, ":batchUpdate", {
        method: "POST",
        body: JSON.stringify({ requests }),
      });
    },
  };
}

export type SheetsClient = ReturnType<typeof createSheetsClient>;
