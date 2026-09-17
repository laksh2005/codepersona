import { isValidGithubUsername } from "@/lib/githubUsername";

/**
 * Builds the canonical /compare/:a/:b path for two usernames — always
 * lowercased and alphabetically sorted, so comparing "torvalds" vs "gaearon"
 * and "gaearon" vs "torvalds" resolve to the exact same URL (and therefore
 * the exact same react-query cache entry). Returns null if either username
 * fails GitHub's format rules, or if they're the same person.
 */
export function canonicalComparePath(userA: string, userB: string): string | null {
  const a = userA.trim().toLowerCase();
  const b = userB.trim().toLowerCase();

  if (!isValidGithubUsername(a) || !isValidGithubUsername(b)) return null;
  if (a === b) return null;

  const [first, second] = [a, b].sort();
  return `/compare/${encodeURIComponent(first)}/${encodeURIComponent(second)}`;
}
