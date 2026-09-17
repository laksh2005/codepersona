import type { JourneyData } from "@/types/journey";
import type { Repo } from "@/lib/topRepo";
import { matchesWholePhrase } from "@/lib/textMatch";

const ARCHETYPES = ["AI / ML", "Web App", "API / Backend", "Mobile", "CLI Tool", "Library"] as const;
export type Archetype = (typeof ARCHETYPES)[number];

// Best-effort keyword classification of a repo from its name/description/topics —
// same approach as the skill and tech taxonomies elsewhere in compare mode.
const ARCHETYPE_KEYWORDS: Record<Archetype, string[]> = {
  "AI / ML": ["ai", "ml", "machine learning", "neural", "model", "llm", "rag", "nlp", "classifier", "cnn", "bert", "gpt", "chatbot", "dataset", "notebook", "vision"],
  "Web App": ["web", "website", "app", "dashboard", "frontend", "react", "next", "landing", "ui"],
  "API / Backend": ["api", "backend", "server", "service", "microservice", "rest", "graphql", "database"],
  Mobile: ["android", "ios", "flutter", "react-native", "mobile"],
  "CLI Tool": ["cli", "command-line", "automation", "bot", "script"],
  Library: ["library", "package", "sdk", "framework", "plugin", "component"],
};

function classifyRepo(repo: Repo): Archetype | null {
  const haystack = [repo.name, repo.description ?? "", ...(repo.topics ?? [])].join(" ");
  for (const archetype of ARCHETYPES) {
    if (ARCHETYPE_KEYWORDS[archetype].some((keyword) => matchesWholePhrase(haystack, keyword))) {
      return archetype;
    }
  }
  return null;
}

export interface ArchetypeSlice {
  archetype: Archetype;
  count: number;
  pct: number;
}

/** Top 3 project archetypes by share of the user's total repos. */
export function archetypeBreakdown(journey: JourneyData): ArchetypeSlice[] {
  const repos = journey.github_data.repos ?? [];
  if (!repos.length) return [];

  const counts = new Map<Archetype, number>();
  for (const repo of repos) {
    const archetype = classifyRepo(repo);
    if (!archetype) continue;
    counts.set(archetype, (counts.get(archetype) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([archetype, count]) => ({ archetype, count, pct: Math.round((count / repos.length) * 100) }));
}
