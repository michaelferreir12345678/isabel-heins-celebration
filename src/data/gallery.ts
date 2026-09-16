/**
 * Fotos da seção "Nossas memórias", na ordem em que aparecem.
 * Os arquivos ficam em public/fotos (originais) e public/fotos/miniaturas (600px, WebP).
 * Legendas e textos alternativos ficam em src/i18n (chave = id).
 */
const photoList = [
  { id: "comeco", file: "foto2", width: 960, height: 1280 },
  { id: "carnaval", file: "foto1", width: 960, height: 1280 },
  { id: "praia", file: "foto8", width: 883, height: 1280 },
  { id: "neve", file: "foto3", width: 960, height: 1280 },
  { id: "sul", file: "foto4", width: 960, height: 1280 },
  { id: "show", file: "foto7", width: 960, height: 1280 },
  { id: "brinde", file: "foto5", width: 960, height: 1280 },
  { id: "pedido", file: "foto6", width: 959, height: 1280 },
] as const;

export const THUMB_WIDTH = 600;

export const photos = photoList.map((photo) => ({
  ...photo,
  src: `/fotos/${photo.file}.jpeg`,
  thumb: `/fotos/miniaturas/${photo.file}.webp`,
}));

export type Photo = (typeof photos)[number];
export type PhotoId = Photo["id"];
