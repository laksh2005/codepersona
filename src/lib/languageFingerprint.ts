import type { JourneyData } from "@/types/journey";

export interface LanguageSlice {
  language: string;
  count: number;
  pct: number;
}

const SLICE_COLORS = [
  "hsl(var(--primary))",
  "hsl(199 89% 62%)",
  "hsl(160 60% 55%)",
  "hsl(280 60% 65%)",
  "hsl(20 80% 60%)",
];

/** Top 5 languages by repo count, as percentages of that user's own total. */
export function languageBreakdown(journey: JourneyData): LanguageSlice[] {
  const languages = journey.github_data.languages ?? {};
  const total = Object.values(languages).reduce((sum, count) => sum + count, 0);
  if (!total) return [];

  return Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language, count]) => ({ language, count, pct: Math.round((count / total) * 100) }));
}

export function sliceColor(index: number): string {
  return SLICE_COLORS[index % SLICE_COLORS.length];
}

/** Jaccard-style overlap: what fraction of the combined language set both people use. */
export function languageOverlap(journeyA: JourneyData, journeyB: JourneyData): { shared: string[]; overlapPct: number } {
  const langsA = new Set(Object.keys(journeyA.github_data.languages ?? {}));
  const langsB = new Set(Object.keys(journeyB.github_data.languages ?? {}));

  const shared = [...langsA].filter((lang) => langsB.has(lang));
  const union = new Set([...langsA, ...langsB]);

  return {
    shared,
    overlapPct: union.size > 0 ? Math.round((shared.length / union.size) * 100) : 0,
  };
}
