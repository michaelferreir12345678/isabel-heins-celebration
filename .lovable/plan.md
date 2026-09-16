# Site de casamento — Isabel e Heins

One-page bilíngue (Português / Espanhol chileno), inspirado na arte enviada: papel off-white artesanal, aquarela botânica no topo, cena campestre ao pôr do sol na base, paleta terracota/coral/pêssego com folhagens.

## Estrutura da página

1. **Navegação minimalista fixa** — links suaves para cada seção + alternador PT/ES instantâneo.
2. **Hero** — arte de fundo, "Isabel e Heins" em caligrafia, 01.11.2026, Fortaleza - Ceará, frase "Vamos celebrar o amor" / "Celebremos el amor", indicador sutil de rolagem.
3. **Introdução** — texto caloroso de boas-vindas.
4. **Nossa História** — timeline editorial com quatro momentos: Estados Unidos, Brasil ↔ Chile, Nossa vida no Chile, 01.11.2026.
5. **Galeria** — layout orgânico assimétrico (masonry) com espaços estéticos para as fotos, prontos para troca.
6. **O Casamento** — 01/11/2026 às 16h, Buffet Le Jardin (Rua General Castelo Branco, 88, Cidade dos Funcionários, Fortaleza - CE), traje fino social, botão "Abrir no Google Maps".
7. **Confirmação de presença** — busca pelo nome do convidado, escolha do convite/família correspondente, marcação de presença de cada membro e confirmação com mensagem de agradecimento.
8. **Lista de presentes simbólicos** — cards temáticos; ao escolher um, abre uma janela de pagamento com duas abas:
   - Brasil: PIX `06321365378` com botão copiar.
   - Chile: Santander — Heins Hanson Powell, RUT 18.022.767-9, Cta Corriente 9425377 2, heins.powell@gmail.com, com botões copiar.
9. **Mensagem final afetiva** e rodapé minimalista.

## Visual

- Tipografia serifada editorial de alto contraste (Cormorant Garamond) para títulos, caligrafia fluida para nomes e destaques, sans leve para textos.
- Paleta em tokens: off-white papel, terracota, coral, pêssego, verde folhagem, tinta quase preta.
- Imagens de aquarela geradas (topo botânico e cena do banco ao pôr do sol) no mesmo espírito da referência.
- Animações discretas de entrada, rolagem suave, mobile-first e acessível (contraste, foco visível, textos alternativos, navegação por teclado).

## Detalhes técnicos

- Todos os textos em `src/i18n/pt.ts` e `src/i18n/es.ts` com um provedor de idioma (contexto React) e preferência salva no navegador.
- Dados configuráveis em `src/data/`: evento, timeline, presentes, convidados/famílias.
- Camada de serviço `src/services/guests.ts` com dados simulados e funções assíncronas (`searchInvites`, `submitRsvp`) isoladas para depois apontar para Google Sheets ou Lovable Cloud sem mexer na interface.
- Seções como componentes em `src/components/sections/`, página única em `src/routes/index.tsx` com metadados próprios.
