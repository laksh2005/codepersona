// HypoText: people get the normal page, known AI agents get the same page as JSON.
//
// This is Vercel Routing Middleware (it works for any framework, not just Next.js).
// It's a copy of HypoText's Next.js middleware (`@hypotext/next`, not on npm yet)
// written against standard Request/Response, since this is a Vite app.
//
// Needs HYPOTEXT_KEY set in Vercel's environment variables. Without it, or if
// HypoText is slow or down, every request just gets the normal page.

const ENDPOINT = (process.env.HYPOTEXT_ENDPOINT ?? "https://hypotext-sigma.vercel.app").replace(/\/$/, "");
const TIMEOUT_MS = 5000;

// Sent when HypoText fetches a page itself, so it gets the human version.
const BYPASS_HEADER = "x-hypotext-bypass";

// Built files and anything that isn't a page.
const NOT_A_PAGE = /^\/assets\/|\.(png|jpe?g|gif|svg|webp|ico|css|js|map|woff2?|xml|json|txt|pdf|mp4|zip)$/i;

// Known AI crawlers and agents, matched on User-Agent. Same list as HypoText's bots.ts.
const BOTS: [RegExp, string][] = [
  [/GPTBot/i, "GPTBot"],
  [/OAI-SearchBot/i, "OAI-SearchBot"],
  [/ChatGPT-User/i, "ChatGPT-User"],
  [/ClaudeBot/i, "ClaudeBot"],
  [/Claude-User/i, "Claude-User"],
  [/Claude-SearchBot/i, "Claude-SearchBot"],
  [/anthropic-ai/i, "anthropic-ai"],
  [/PerplexityBot/i, "PerplexityBot"],
  [/Perplexity-User/i, "Perplexity-User"],
  [/Google-Extended/i, "Google-Extended"],
  [/GoogleOther/i, "GoogleOther"],
  [/Applebot-Extended/i, "Applebot-Extended"],
  [/meta-externalagent/i, "Meta-ExternalAgent"],
  [/Bytespider/i, "Bytespider"],
  [/Amazonbot/i, "Amazonbot"],
  [/cohere-ai/i, "cohere-ai"],
  [/MistralAI-User/i, "MistralAI-User"],
  [/YouBot/i, "YouBot"],
  [/DuckAssistBot/i, "DuckAssistBot"],
  [/CCBot/i, "CCBot"],
];

function detectBot(userAgent: string | null): string | null {
  if (!userAgent) return null;
  for (const [pattern, name] of BOTS) if (pattern.test(userAgent)) return name;
  return null;
}

// Tells Vercel to carry on and serve the normal page (what `next()` from @vercel/functions does).
function next(): Response {
  return new Response(null, { headers: { "x-middleware-next": "1" } });
}

export default async function middleware(req: Request): Promise<Response> {
  const siteKey = process.env.HYPOTEXT_KEY;
  if (!siteKey) return next();

  // Only page loads get JSON; HypoText's own fetches and other methods pass through.
  if (req.headers.get(BYPASS_HEADER) || (req.method !== "GET" && req.method !== "HEAD")) return next();

  const url = new URL(req.url);
  const key = encodeURIComponent(siteKey);

  // A plain-text map of the site for AI agents.
  if (url.pathname === "/llms.txt") {
    const res = await forward(`${ENDPOINT}/api/v1/llms?key=${key}&origin=${encodeURIComponent(url.origin)}`);
    return res.ok ? res : next();
  }

  if (NOT_A_PAGE.test(url.pathname)) return next();

  // ?view=ai lets a person preview what agents get.
  const bot = detectBot(req.headers.get("user-agent"));
  const preview = url.searchParams.get("view") === "ai";
  if (!bot && !preview) return next();

  url.searchParams.delete("view");
  const botName = bot ?? "Preview (?view=ai)";

  const res = await forward(
    `${ENDPOINT}/api/v1/serve?key=${key}&url=${encodeURIComponent(url.toString())}&bot=${encodeURIComponent(botName)}`,
  );
  // If HypoText can't answer, fail open: the agent gets the normal page.
  return res.ok ? res : next();
}

async function forward(target: string): Promise<Response> {
  try {
    const r = await fetch(target, {
      headers: { [BYPASS_HEADER]: "1" },
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const cacheControl = r.headers.get("cache-control");
    return new Response(r.body, {
      status: r.status,
      headers: {
        "content-type": r.headers.get("content-type") ?? "application/json",
        vary: "user-agent",
        "x-hypotext": "served",
        ...(cacheControl ? { "cache-control": cacheControl } : {}),
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}

// Skip Vite's built assets entirely so normal page loads stay fast.
export const config = { matcher: ["/((?!assets/).*)"] };
