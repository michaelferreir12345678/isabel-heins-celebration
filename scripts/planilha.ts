/**
 * Ferramentas da planilha de convidados (veja docs/confirmacao-de-presenca.md).
 *
 *   npm run planilha:preparar   cria as abas "Convidados" e "Respostas"
 *   npm run planilha:links      gera os códigos que faltam e lista o link de cada convite
 *
 * As credenciais vêm do arquivo .env.local.
 */
import { sheetsConfigFromEnv } from "../src/server/google-sheets.ts";
import { createGuestSheet, inviteLink } from "../src/server/guest-sheet.ts";

const command = process.argv[2];
const config = sheetsConfigFromEnv(process.env);

if (!config) {
  console.error(
    "Faltam as variáveis GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL e GOOGLE_PRIVATE_KEY no .env.local.",
  );
  process.exit(1);
}

const siteUrl = process.env["SITE_URL"];
const sheet = createGuestSheet(config, { siteUrl });

if (command === "preparar") {
  await sheet.prepare();
  console.log('Planilha pronta: abas "Convidados" e "Respostas" criadas.');
  console.log("Agora preencha a aba Convidados com uma linha por pessoa (colunas Convite e Nome).");
} else if (command === "links") {
  if (!siteUrl) {
    console.error("Defina SITE_URL no .env.local (ex.: https://isabel-e-heins.vercel.app).");
    process.exit(1);
  }
  const invites = await sheet.loadInvites();
  if (!invites.length) {
    console.log("Nenhum convite encontrado na aba Convidados.");
  }
  for (const invite of invites) {
    const names = invite.members.map((member) => member.name).join(", ");
    console.log(`${invite.title} (${names})\n  ${inviteLink(siteUrl, invite.code)}\n`);
  }
  console.log(
    `${invites.length} convite(s). Os links também ficaram na coluna "Link" da planilha.`,
  );
} else {
  console.log("Uso: npm run planilha:preparar | npm run planilha:links");
  process.exit(1);
}
