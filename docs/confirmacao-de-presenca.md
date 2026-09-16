# Confirmação de presença com Google Planilhas

O site guarda a lista de convidados e as respostas numa planilha do Google.
Os convidados encontram o convite pelo link personalizado (enviado pelo WhatsApp)
ou buscando nome e sobrenome. A lista completa nunca é enviada para o navegador.

Para funcionar, são 4 coisas: a planilha, um "robô" do Google (conta de serviço) com
permissão para editar essa planilha, as credenciais desse robô no projeto e na Vercel,
e os convidados preenchidos.

## 1. Criar a planilha

1. Entre em <https://sheets.google.com> com a conta Google de vocês (de preferência um Gmail pessoal).
2. Crie uma planilha em branco, por exemplo "Casamento Isabel e Heins - Convidados".
3. Copie o **ID** da planilha: é o trecho do endereço entre `/d/` e `/edit`.
   Em `https://docs.google.com/spreadsheets/d/1AbC...xYz/edit`, o ID é `1AbC...xYz`.

Não precisa criar abas nem colunas: o comando do passo 4 faz isso.

## 2. Criar a conta de serviço (o robô do site)

1. Entre em <https://console.cloud.google.com> com a mesma conta.
2. No topo, clique no seletor de projetos e em **Novo projeto**. Nome: `casamento-isabel-heins`.
3. Com o projeto selecionado, vá em **APIs e serviços > Biblioteca**, procure
   **Google Sheets API** e clique em **Ativar**.
4. Vá em **IAM e administrador > Contas de serviço > Criar conta de serviço**.
   Nome: `site-casamento`. Clique em **Criar e continuar** e depois em **Concluir**
   (não precisa escolher papel).
5. Abra a conta criada, vá na aba **Chaves > Adicionar chave > Criar nova chave**,
   escolha **JSON** e confirme. Um arquivo `.json` será baixado.

Esse arquivo é a senha do robô: não mande por WhatsApp ou e-mail e não coloque no GitHub.
Dele vamos usar dois campos: `client_email` e `private_key`.

## 3. Compartilhar a planilha com o robô

Na planilha, clique em **Compartilhar**, cole o `client_email` do arquivo JSON
(termina com `iam.gserviceaccount.com`), escolha **Editor**, desmarque
"Notificar pessoas" e confirme.

## 4. Configurar o projeto

1. Na pasta do projeto, copie o arquivo `.env.example` para `.env.local`.
2. Preencha:
   - `GOOGLE_SHEETS_ID`: o ID do passo 1;
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`: o `client_email` do JSON;
   - `GOOGLE_PRIVATE_KEY`: o `private_key` do JSON, entre aspas, exatamente como aparece lá
     (começa com `-----BEGIN PRIVATE KEY-----` e tem vários `\n`);
   - `SITE_URL`: o endereço público do site (ex.: `https://isabel-e-heins.vercel.app`).
3. Rode:

   ```sh
   npm run planilha:preparar
   ```

   A planilha ganha as abas **Convidados** e **Respostas**, com cabeçalhos,
   lista suspensa de presença e cores.

O `.env.local` já está no `.gitignore`, então não vai para o GitHub.

## 5. Preencher os convidados

Na aba **Convidados**, uma linha por pessoa. Preencha só duas colunas:

| Código | Convite | Nome | Presença | Recado | Respondido em | Link |
|---|---|---|---|---|---|---|
| | Família Oliveira | Maria Oliveira | | | | |
| | Família Oliveira | João Oliveira | | | | |
| | Ana Beatriz Lima e acompanhante | Ana Beatriz Lima | | | | |
| | Ana Beatriz Lima e acompanhante | Acompanhante de Ana | | | | |

- **Convite**: o nome que a família vê no site. Todas as pessoas do mesmo convite
  devem ter exatamente o mesmo texto aqui. Se duas famílias tiverem o mesmo nome,
  diferencie (ex.: "Família Silva (Recife)").
- **Nome**: nome e sobrenome, do jeito que a pessoa digitaria na busca.
- **Código** e **Link** são preenchidos pelo site. **Presença**, **Recado** e
  **Respondido em** são preenchidos quando a pessoa confirma.
- Pode ordenar e filtrar as linhas à vontade, mas não renomeie as abas nem mude a
  ordem das colunas.
- Vocês também podem marcar a presença à mão (ex.: alguém confirmou por telefone)
  usando a lista suspensa.

## 6. Gerar e enviar os links

```sh
npm run planilha:links
```

O comando cria os códigos que faltam, grava o link de cada pessoa na coluna **Link**
e mostra a lista no terminal. É só mandar o link para cada família pelo WhatsApp.
Se o endereço do site mudar (ex.: domínio próprio), atualize `SITE_URL` e rode de novo.

## 7. Receber aviso a cada resposta

Na planilha: **Ferramentas > Regras de notificação > Qualquer alteração > Imediatamente**.
Faça uma confirmação de teste para ver se o e-mail chega.

As respostas também ficam registradas, com data e hora, na aba **Respostas**
(inclusive quando alguém muda de ideia).

## 8. Publicar na Vercel

1. Em <https://vercel.com>, importe o repositório do GitHub.
2. Em **Settings > Environment Variables**, cadastre as mesmas 4 variáveis do `.env.local`.
   Em `GOOGLE_PRIVATE_KEY`, cole o valor sem as aspas.
3. Faça o deploy. O build já se ajusta sozinho para a Vercel.

## Prazo para confirmar

O prazo fica em `src/data/site.ts` (`rsvp.deadline`). Depois dele, o site mostra
que as confirmações foram encerradas e não aceita novas respostas.

## Testar sem planilha

Sem as variáveis do Google, o `npm run dev` usa convidados de demonstração.
Links de teste: `http://localhost:8080/?convite=DEMO01#presenca` (vai até `DEMO06`),
ou busque por "Maria Oliveira".
