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

/**
 * Pontuação para as sugestões enquanto a pessoa digita (0 = não sugerir).
 * Cada palavra digitada precisa ser o começo de uma palavra diferente do nome
 * ("bea fir" → Beatriz Firmeza), aceitando um erro de digitação a partir de 5 letras.
 * Quem começa pelo primeiro nome aparece antes.
 */
export function suggestionScore(queryWords: string[], nameWords: string[]) {
  if (!queryWords.length) return 0;
  const available = nameWords.map((word, index) => ({ word, index }));
  let score = 0;

  for (const query of queryWords) {
    let bestPosition = -1;
    let bestPoints = 0;
    for (const [position, { word }] of available.entries()) {
      let points = 0;
      if (word === query) points = 3;
      else if (word.startsWith(query)) points = 2;
      else if (
        query.length >= MIN_FUZZY_LENGTH &&
        (withinOneEdit(query, word) || withinOneEdit(query, word.slice(0, query.length)))
      ) {
        points = 1;
      }
      if (points > bestPoints) {
        bestPoints = points;
        bestPosition = position;
        if (points === 3) break;
      }
    }
    if (!bestPoints) return 0;
    const [matched] = available.splice(bestPosition, 1);
    score += bestPoints + (matched?.index === 0 ? 1 : 0);
  }
  return score;
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
