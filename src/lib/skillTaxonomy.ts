import { matchesWholePhrase } from "@/lib/textMatch";

export const SKILL_CATEGORIES = [
  "AI / ML",
  "Full-Stack",
  "System Design",
  "Problem Solving",
  "UX / Design",
  "Data & Integration",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export interface RawSkill {
  name: string;
  score: number;
  reasoning?: string;
}

// Every persona's skill list is free-text, generated per-profile by the LLM —
// two people can both be "AI-focused" but come back with skill names like
// "AI/ML Engineering" vs "Machine Learning & Automation", or something as
// specific as "TypeScript Mastery" or "Rapid Prototyping & Execution" that
// doesn't obviously announce its own category at all. There's no shared ID
// to join on, so comparing two people's skills means bucketing both into a
// fixed vocabulary first. This is a best-effort keyword match, not a precise
// classifier — good enough to plot two people on the same radar axes. The
// lists are intentionally broad: an earlier, narrower version silently
// dropped skills whose names didn't happen to contain an exact keyword
// (including someone's single highest-scored skill), which then biased
// which category looked "strongest" purely by which one had less missing data.
const CATEGORY_KEYWORDS: Record<SkillCategory, string[]> = {
  "AI / ML": [
    "ai", "ml", "machine learning", "artificial intelligence", "llm", "nlp", "deep learning", "data science",
    "neural", "model", "rag", "gpt", "chatbot", "computer vision", "genai", "generative",
  ],
  "Full-Stack": [
    "full-stack", "full stack", "frontend", "front-end", "backend", "back-end", "web development", "api",
    "typescript", "javascript", "react", "next.js", "node", "web app", "mobile", "software development",
    "programming", "coding", "app development", "developer", "engineering",
  ],
  "System Design": [
    "system design", "architecture", "scalab", "infrastructure", "distributed", "systems programming",
    "performance", "networking", "low-level", "devops", "cloud", "microservice", "reliability",
  ],
  "Problem Solving": [
    "problem solving", "problem-solving", "innovation", "creativity", "critical thinking", "prototyping",
    "rapid", "execution", "ideation", "delivery", "resourcefulness", "adaptability", "initiative",
  ],
  "UX / Design": ["ux", "ui", "user experience", "design", "accessibility", "usability", "interface"],
  "Data & Integration": [
    "data integration", "data management", "database", "etl", "pipeline", "api integration", "integration",
    "data handling", "data engineering", "automation",
  ],
};

/**
 * Tries the skill name first, then falls back to its reasoning text — the
 * name alone is often too terse or idiosyncratic to contain any keyword
 * ("TypeScript Mastery"), while the reasoning usually spells out the actual
 * domain in plain language.
 */
function matchCategory(skill: RawSkill): SkillCategory | null {
  for (const category of SKILL_CATEGORIES) {
    if (CATEGORY_KEYWORDS[category].some((keyword) => matchesWholePhrase(skill.name, keyword))) {
      return category;
    }
  }
  if (skill.reasoning) {
    for (const category of SKILL_CATEGORIES) {
      if (CATEGORY_KEYWORDS[category].some((keyword) => matchesWholePhrase(skill.reasoning!, keyword))) {
        return category;
      }
    }
  }
  return null;
}

interface CategoryBucket {
  scores: number[];
}

function buildBuckets(skills: RawSkill[]): Map<SkillCategory, CategoryBucket> {
  const buckets = new Map<SkillCategory, CategoryBucket>();
  for (const skill of skills) {
    const category = matchCategory(skill);
    if (!category) continue;
    const bucket = buckets.get(category) ?? { scores: [] };
    bucket.scores.push(skill.score);
    buckets.set(category, bucket);
  }
  return buckets;
}

/**
 * Averages a person's skill scores into the fixed SKILL_CATEGORIES axes, so
 * two people's skill lists — however differently worded — can be plotted on
 * the same radar. Categories with no matching skill score 0.
 */
export function categorizeSkills(skills: RawSkill[]): Record<SkillCategory, number> {
  const buckets = buildBuckets(skills);
  const result = {} as Record<SkillCategory, number>;
  for (const category of SKILL_CATEGORIES) {
    const scores = buckets.get(category)?.scores;
    result[category] = scores?.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }
  return result;
}

/**
 * A person's single strongest skill category, computed directly from their
 * raw skill list (not the already-averaged scores) so ties can be broken by
 * how much evidence backs each category — e.g. two categories both averaging
 * 85 shouldn't just pick whichever happens to be listed first; the one
 * averaged from more matched skills is the better-supported answer.
 */
export function topCategory(skills: RawSkill[]): { category: SkillCategory; score: number } | null {
  const buckets = buildBuckets(skills);
  let best: { category: SkillCategory; score: number; count: number } | null = null;

  for (const [category, bucket] of buckets) {
    const score = Math.round(bucket.scores.reduce((a, b) => a + b, 0) / bucket.scores.length);
    const count = bucket.scores.length;
    if (
      !best ||
      score > best.score ||
      (score === best.score && count > best.count)
    ) {
      best = { category, score, count };
    }
  }

  return best ? { category: best.category, score: best.score } : null;
}
