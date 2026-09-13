import type { JourneyData } from "@/types/journey";

const HEIGHT = 20;
const FONT = "600 11px Verdana, DejaVu Sans, sans-serif";
const H_PADDING = 10;
const LEFT_COLOR = "#1f2023";
const RIGHT_COLOR = "#c8a869";

function measureTextWidth(text: string): number {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return text.length * 6.5; // crude fallback, should never hit in a browser
  ctx.font = FONT;
  return ctx.measureText(text).width;
}

/**
 * Builds a shields.io-style two-tone badge SVG for a Code Persona report,
 * e.g. [ code persona | The Prolific AI Innovator ]. Downloadable and
 * embeddable in a README once the user commits it to their own repo —
 * there's no backend to host a live, hotlinkable badge endpoint.
 */
export function generatePersonaBadgeSvg(journey: JourneyData): string {
  const leftLabel = "code persona";
  const rightLabel = journey.ai_persona?.title || `@${journey.github_username}`;

  const leftWidth = measureTextWidth(leftLabel) + H_PADDING * 2;
  const rightWidth = measureTextWidth(rightLabel) + H_PADDING * 2;
  const totalWidth = Math.round(leftWidth + rightWidth);

  const leftTextX = leftWidth / 2;
  const rightTextX = leftWidth + rightWidth / 2;
  const textY = HEIGHT / 2 + 1;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${HEIGHT}" role="img" aria-label="${leftLabel}: ${rightLabel}">
  <title>${leftLabel}: ${rightLabel}</title>
  <clipPath id="round">
    <rect width="${totalWidth}" height="${HEIGHT}" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#round)">
    <rect width="${leftWidth}" height="${HEIGHT}" fill="${LEFT_COLOR}"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="${HEIGHT}" fill="${RIGHT_COLOR}"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,DejaVu Sans,sans-serif" font-size="11" font-weight="600">
    <text x="${leftTextX}" y="${textY}" dominant-baseline="middle">${leftLabel}</text>
    <text x="${rightTextX}" y="${textY}" dominant-baseline="middle" fill="#1f2023">${rightLabel}</text>
  </g>
</svg>`;
}

export function downloadPersonaBadge(journey: JourneyData) {
  const svg = generatePersonaBadgeSvg(journey);
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${journey.github_username}-codepersona-badge.svg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function markdownEmbedSnippet(journey: JourneyData, filename: string): string {
  return `[![Code Persona](./${filename})](https://codepersona.app/${journey.github_username})`;
}
