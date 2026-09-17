import type { JourneyData } from "@/types/journey";
import { matchesWholePhrase } from "@/lib/textMatch";

export interface TechStackDiff {
  shared: string[];
  onlyA: string[];
  onlyB: string[];
}

// Ordered most-specific first, so e.g. "Node.js" is caught before a bare
// generic term would otherwise swallow it. The LLM generates free-text tech
// mentions per phase ("JavaScript (for web integration)", "Python (for
// advanced AI/ML)", "Initial TypeScript Adoption", "TypeScript (dominant)")
// which are all really just one technology wearing different descriptive
// wrapping — comparing those verbatim treats each phrasing as a distinct
// entry, which is what made "Only X" columns balloon with near-duplicates.
const CANONICAL_TECHS = [
  "React Native", "Node.js", "Next.js", "Nest.js", "Vue.js", "Vue", "Angular", "Svelte",
  "TensorFlow", "Keras", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
  "LangChain", "LangGraph", "NLTK", "SpaCy", "Hugging Face", "RAG", "OpenCV",
  "TypeScript", "JavaScript", "Python", "Java", "Golang", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "C++", "C#",
  "HTML", "CSS", "Tailwind", "Bootstrap", "SASS",
  "React", "Redux", "GraphQL", "REST", "Express", "Django", "Flask", "FastAPI", "jQuery",
  "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Redis", "Firebase", "Supabase",
  "Docker", "Kubernetes", "AWS", "GCP", "Azure",
  "Jupyter Notebook", "Git", "GitHub Actions", "CLI",
];

/**
 * Splits one free-text tech mention into one or more canonical technology
 * names. A phrase can name several real technologies ("JavaScript (Node.js)"
 * → both), and a phrase naming none falls back to itself with any trailing
 * parenthetical annotation stripped, so at minimum the "(implied)"-style
 * noise is dropped even for entries outside the known-technology list.
 */
function normalizeTechNames(raw: string): string[] {
  const found = CANONICAL_TECHS.filter((tech) => matchesWholePhrase(raw, tech));
  if (found.length > 0) return found;

  const cleaned = raw.replace(/\s*\([^)]*\)\s*$/, "").trim();
  return [cleaned || raw];
}

function flattenTechnologies(journey: JourneyData): Map<string, string> {
  const byLowerCase = new Map<string, string>(); // lowercase -> display name (first seen)
  for (const phase of journey.ai_tech_evolution?.phases ?? []) {
    for (const tech of phase.technologies ?? []) {
      for (const normalized of normalizeTechNames(tech)) {
        const key = normalized.toLowerCase();
        if (!byLowerCase.has(key)) byLowerCase.set(key, normalized);
      }
    }
  }
  return byLowerCase;
}

export function diffTechStacks(journeyA: JourneyData, journeyB: JourneyData): TechStackDiff {
  const a = flattenTechnologies(journeyA);
  const b = flattenTechnologies(journeyB);

  const shared: string[] = [];
  const onlyA: string[] = [];
  const onlyB: string[] = [];

  for (const [key, original] of a) {
    if (b.has(key)) shared.push(original);
    else onlyA.push(original);
  }
  for (const [key, original] of b) {
    if (!a.has(key)) onlyB.push(original);
  }

  return { shared, onlyA, onlyB };
}
