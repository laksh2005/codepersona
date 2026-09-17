import type { JourneyData } from "@/types/journey";

export type Repo = JourneyData["github_data"]["repos"][number];

/** The single highest-starred repo (ties broken by forks), or null if the user has none. */
export function getTopRepo(journey: JourneyData): Repo | null {
  const repos = journey.github_data.repos ?? [];
  if (!repos.length) return null;

  return [...repos].sort((a, b) => {
    return b.stargazers_count - a.stargazers_count || b.forks_count - a.forks_count;
  })[0];
}
