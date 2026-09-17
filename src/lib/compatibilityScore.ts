import type { SkillCategory } from "@/lib/skillTaxonomy";

/**
 * A single 0-100 "compatibility" number between two people's normalized skill
 * profiles, via cosine similarity between their category-score vectors. It's
 * a fun, shareable gimmick stat — not a rigorous claim about how well two
 * developers would actually work together.
 */
export function computeCompatibility(
  scoresA: Record<SkillCategory, number>,
  scoresB: Record<SkillCategory, number>
): number {
  const categories = Object.keys(scoresA) as SkillCategory[];

  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (const category of categories) {
    const a = scoresA[category] ?? 0;
    const b = scoresB[category] ?? 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }

  if (magA === 0 || magB === 0) return 0;

  const cosineSimilarity = dot / (Math.sqrt(magA) * Math.sqrt(magB));
  return Math.round(Math.max(0, Math.min(1, cosineSimilarity)) * 100);
}
