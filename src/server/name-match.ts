/**
 * Compara o nome digitado na busca com o nome cadastrado na planilha, tolerando:
 * - palavras a mais ou a menos (ex.: um sobrenome do meio que não está na planilha);
 * - uma letra trocada, faltando, sobrando ou invertida em palavras de 5 letras ou mais
 *   (Souza/Sousa, Luiza/Luisa, Firmesa/Firmeza);
 * - palavra incompleta com 5 letras ou mais (Firmez → Firmeza).
 *
 * Para que pedaços de nome não revelem a lista, exige ao menos duas palavras
 * reconhecidas, sendo uma delas escrita por inteiro.
 *
 * Recebe palavras já normalizadas (sem acentos, minúsculas). Sem imports, para
 * poder ser testado direto com `node`.
 */

const MIN_FUZZY_LENGTH = 5;

/** Distância de edição até 1, contando a troca de duas letras vizinhas como um erro só. */
function withinOneEdit(a: string, b: string) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;

  if (a.length === b.length) {
    const diffs: number[] = [];
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) diffs.push(i);
      if (diffs.length > 2) return false;
    }
    if (diffs.length === 1) return true;
    const [first, second] = diffs;
    return (
      first !== undefined &&
      second === first + 1 &&
      a[first] === b[second] &&
      a[second] === b[first]
    );
  }

  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a];
  let i = 0;
  let j = 0;
  let skipped = false;
  while (i < shorter.length && j < longer.length) {
    if (shorter[i] === longer[j]) {
      i++;
      j++;
    } else if (skipped) {
      return false;
    } else {
      skipped = true;
      j++;
    }
  }
  return true;
}

type WordMatch = "exact" | "close" | null;

function matchWord(query: string, name: string): WordMatch {
  if (query === name) return "exact";
  if (query.length < MIN_FUZZY_LENGTH) return null;
  if (name.startsWith(query)) return "close";
  if (name.length >= MIN_FUZZY_LENGTH && withinOneEdit(query, name)) return "close";
  return null;
}

/** Pontuação da semelhança (0 = não é a pessoa). Quanto maior, melhor. */
export function nameMatchScore(queryWords: string[], nameWords: string[]) {
  const available = [...nameWords];
  let exact = 0;
  let close = 0;

  for (const query of queryWords) {
    let bestIndex = -1;
    let best: WordMatch = null;
    for (const [index, word] of available.entries()) {
      const match = matchWord(query, word);
      if (match === "exact") {
        best = match;
        bestIndex = index;
        break;
      }
      if (match === "close" && best === null) {
        best = match;
        bestIndex = index;
      }
    }
    if (best === null) continue;
    // Cada palavra do nome só pode ser reconhecida uma vez.
    available.splice(bestIndex, 1);
    if (best === "exact") exact++;
    else close++;
  }

  if (exact < 1 || exact + close < 2) return 0;
  return exact * 2 + close;
}
