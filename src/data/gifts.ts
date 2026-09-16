import {
  Activity,
  Languages,
  Luggage,
  Martini,
  Music,
  Plane,
  Salad,
  Shrimp,
  Snowflake,
  Sun,
  TreePalm,
  Wine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Lista de presentes. Títulos e descrições ficam em src/i18n (chave = id).
 * Os valores em pesos chilenos usam uma conversão aproximada (R$ 1 ≈ CLP 170), arredondada.
 */
export const gifts = [
  { id: "terremoto", icon: Wine, brl: 60, clp: 10_000 },
  { id: "pisco", icon: Martini, brl: 70, clp: 12_000 },
  { id: "palta", icon: Salad, brl: 80, clp: 14_000 },
  { id: "protetor", icon: Sun, brl: 90, clp: 15_000 },
  { id: "guatero", icon: Snowflake, brl: 120, clp: 20_000 },
  { id: "temblor", icon: Activity, brl: 150, clp: 25_000 },
  { id: "caranguejo", icon: Shrimp, brl: 180, clp: 30_000 },
  { id: "forro", icon: Music, brl: 200, clp: 35_000 },
  { id: "rede", icon: TreePalm, brl: 250, clp: 42_000 },
  { id: "tradutor", icon: Languages, brl: 300, clp: 50_000 },
  { id: "mala", icon: Luggage, brl: 350, clp: 60_000 },
  { id: "luaDeMel", icon: Plane, brl: 1_000, clp: 170_000 },
] as const satisfies readonly { id: string; icon: LucideIcon; brl: number; clp: number }[];

export type Gift = (typeof gifts)[number];
export type GiftId = Gift["id"];
