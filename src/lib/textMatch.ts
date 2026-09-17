function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whole-word/whole-phrase matching, not substring — plain `.includes()`
 * matching against a haystack of user- or LLM-generated free text is a
 * reliable source of false positives: "ai" matches inside "container",
 * "email", "domain"; "ml" matches inside "html"; "java" matches inside
 * "javascript"; "go" matches inside "django", "mongodb", "diagram". This
 * bug pattern showed up independently in three different classifiers in
 * this codebase before being centralized here.
 */
export function matchesWholePhrase(haystack: string, phrase: string): boolean {
  const pattern = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, "i");
  return pattern.test(haystack);
}
