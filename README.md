# Isabel & Heins: Our Celebration

Site de casamento completo, sofisticado e responsivo de Isabel e Heins para 01.11.2026 em Fortaleza - Ceará.

Referência visual:
- Nomes dos noivos: Isabel e Heins
- Estilo: papel artesanal/off-white suave, aquarela botânica no topo e cena campestre poética com banco e árvores ao pôr do sol na base, paleta de terracota, coral, pêssego, tons quentes e folhagens naturais.
- Tipografia: serifada editorial elegante de alto contraste (estilo Higuen Serif / Cormorant Garamond / Playfair) e caligrafia fluida e refinada para destaques e nomes (estilo Angeletta).

Requisitos principais:
1. One-page elegante com rolagem suave e navegação minimalista no topo com alternador de idiomas instantâneo bilíngue (Português e Espanhol Chileno natural).
2. Hero impactante trazendo a arte de referência, nomes Isabel e Heins, data 01.11.2026, Fortaleza - Ceará e frase "Vamos celebrar o amor" / "Celebremos el amor" com indicador sutil de rolagem.
3. Seção de Introdução calorosa.
4. Nossa História / Nuestra historia com timeline editorial dividida pelos momentos: Estados Unidos, Brasil ↔ Chile, Nossa vida no Chile, 01.11.2026.
5. Galeria / Nossas memórias em layout editorial orgânico (masonry/assimétrico) com placeholders estéticos.
6. O Casamento / La boda com data (01/11/2026 às 16h), local (Buffet Le Jardin - Rua General Castelo Branco, 88, Cidade dos Funcionários, Fortaleza - CE), traje Fino social e botão para abrir no Google Maps.
7. Confirmação de Presença (RSVP) com camada de serviço simulando consulta a convidados/famílias específicas (busca por nome, seleção do convite correspondente, marcação de presenças por membro e confirmação), pronta para plugar em Google Sheets/Supabase.
8. Lista de Presentes Simbólicos com cards temáticos e modal de pagamento com duas abas: Brasil (PIX com chave 06321365378 e botão de copiar) e Chile (transferência bancária Santander: Heins Hanson Powell, RUT 18.022.767-9, Cta Corriente 9425377 2, heins.powell@gmail.com com botão de cópia).
9. Mensagem final afetiva e rodapé minimalista.
10. Arquitetura limpa com textos centralizados em arquivos de tradução (pt e es), dados configuráveis e alta atenção à acessibilidade e responsividade mobile-first.

## Desenvolvimento

Requer Node.js e npm ([instale com o nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
git clone https://github.com/michaelferreir12345678/isabel-heins-celebration.git
cd isabel-heins-celebration
npm i
npm run dev
```

O servidor de desenvolvimento sobe em http://localhost:8080.

## Confirmação de presença

A lista de convidados e as respostas ficam numa planilha do Google. O passo a passo de configuração está em [docs/confirmacao-de-presenca.md](docs/confirmacao-de-presenca.md).

## Build

```sh
npm run build
node .output/server/index.mjs
```

O build usa o [Nitro](https://nitro.build), que detecta automaticamente o provedor de hospedagem (Vercel, Netlify, Cloudflare etc.) e gera um servidor Node por padrão.
