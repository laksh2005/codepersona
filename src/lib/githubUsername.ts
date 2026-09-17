// GitHub's actual username rules: alphanumeric, single hyphens, no leading/trailing
// hyphen, max 39 chars. Used to validate input before it ever reaches a route or a
// network call.
const GITHUB_USERNAME_RE = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/;

export function isValidGithubUsername(value: string): boolean {
  return GITHUB_USERNAME_RE.test(value.trim());
}
