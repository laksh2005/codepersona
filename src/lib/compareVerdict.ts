import type { JourneyData } from "@/types/journey";
import type { SkillCategory } from "@/lib/skillTaxonomy";

interface VerdictInput {
  journeyA: JourneyData;
  journeyB: JourneyData;
  topA: { category: SkillCategory; score: number } | null;
  topB: { category: SkillCategory; score: number } | null;
}

function displayName(journey: JourneyData): string {
  return journey.github_data.user.name?.trim() || journey.github_username;
}

/**
 * A short, templated (not AI-generated) comparison line built purely from
 * data already on both persona records — no new LLM call, so it works
 * without backend access. Takes the already-computed top skill category for
 * each person (see skillTaxonomy.ts's topCategory) rather than recomputing
 * its own, so this sentence can never contradict what's shown elsewhere on
 * the page.
 */
export function buildVerdict({ journeyA, journeyB, topA, topB }: VerdictInput): string {
  const nameA = displayName(journeyA);
  const nameB = displayName(journeyB);

  const sentences: string[] = [];

  if (topA && topB && topA.category !== topB.category) {
    sentences.push(`${nameA} leans more into ${topA.category}, while ${nameB} shows more strength in ${topB.category}.`);
  } else if (topA && topB && topA.category === topB.category) {
    sentences.push(`Both ${nameA} and ${nameB} are strongest in ${topA.category}.`);
  }

  const reposA = journeyA.github_data.repos?.length ?? 0;
  const reposB = journeyB.github_data.repos?.length ?? 0;
  if (reposA !== reposB) {
    const [more, fewer, moreCount, fewerCount] =
      reposA > reposB ? [nameA, nameB, reposA, reposB] : [nameB, nameA, reposB, reposA];
    sentences.push(`${more} has shipped more public repos (${moreCount} vs ${fewer}'s ${fewerCount}).`);
  }

  return sentences.join(" ") || `${nameA} and ${nameB} have taken different but equally interesting paths.`;
}
