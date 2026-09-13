import type { JourneyData } from "@/types/journey";

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;
const PADDING = 72;

const GOLD = "#c8a869";
const MUTED = "#9a938c";
const FG = "#f5f2ee";
const BG = "#141110";

function el(tag: string, styles: Partial<CSSStyleDeclaration>, text?: string): HTMLElement {
  const node = document.createElement(tag);
  Object.assign(node.style, styles);
  if (text !== undefined) node.textContent = text;
  return node;
}

function statBlock(label: string, value: string): HTMLElement {
  const wrap = el("div", { display: "flex", flexDirection: "column", gap: "6px" });
  wrap.appendChild(
    el(
      "div",
      {
        fontSize: "15px",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        color: MUTED,
        fontWeight: "600",
      },
      label
    )
  );
  wrap.appendChild(
    el("div", { fontSize: "40px", fontWeight: "700", color: GOLD, lineHeight: "1" }, value)
  );
  return wrap;
}

function buildCardElement(journey: JourneyData): HTMLDivElement {
  const { github_data, ai_persona, ai_skills } = journey;
  const { user, repos } = github_data;
  const topSkills = (ai_skills?.skills ?? []).slice(0, 3);
  const joinYear = user.created_at ? new Date(user.created_at).getFullYear() : null;

  const card = document.createElement("div") as HTMLDivElement;
  Object.assign(card.style, {
    width: `${CARD_WIDTH}px`,
    height: `${CARD_HEIGHT}px`,
    position: "fixed",
    left: "-9999px",
    top: "0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: `${PADDING}px`,
    background: BG,
    color: FG,
    fontFamily: "Inter, system-ui, sans-serif",
    boxSizing: "border-box",
    // Thin gold rule down the left edge ties the whole card together and gives
    // the left-aligned content a visual spine to sit against.
    borderLeft: `6px solid ${GOLD}`,
  });

  /* ---------- Header: avatar + identity ---------- */
  const header = el("div", { display: "flex", alignItems: "center", gap: "28px" });

  const avatar = document.createElement("img");
  avatar.src = user.avatar_url;
  avatar.crossOrigin = "anonymous";
  Object.assign(avatar.style, {
    width: "112px",
    height: "112px",
    borderRadius: "9999px",
    objectFit: "cover",
    border: `3px solid rgba(200,168,105,0.45)`,
    flexShrink: "0",
  });

  const identity = el("div", { display: "flex", flexDirection: "column", gap: "6px" });
  identity.appendChild(
    el("div", { fontSize: "46px", fontWeight: "700", lineHeight: "1.1" }, user.name || journey.github_username)
  );
  identity.appendChild(el("div", { fontSize: "24px", color: MUTED }, `@${journey.github_username}`));

  header.appendChild(avatar);
  header.appendChild(identity);

  /* ---------- Middle: persona title + stats ---------- */
  const middle = el("div", { display: "flex", flexDirection: "column", gap: "36px" });

  if (ai_persona?.title) {
    middle.appendChild(
      el(
        "div",
        {
          fontSize: "42px",
          fontStyle: "italic",
          fontWeight: "600",
          color: GOLD,
          lineHeight: "1.2",
          maxWidth: "980px",
        },
        ai_persona.title
      )
    );
  }

  const stats = el("div", { display: "flex", gap: "72px", alignItems: "flex-end" });
  stats.appendChild(statBlock("Public Repos", String(repos?.length ?? user.public_repos ?? 0)));
  stats.appendChild(statBlock("Followers", String(user.followers ?? 0)));
  if (joinYear) stats.appendChild(statBlock("Since", String(joinYear)));
  middle.appendChild(stats);

  /* ---------- Footer: skills + wordmark ---------- */
  const footer = el("div", {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "24px",
  });

  const skillsRow = el("div", { display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap" });
  topSkills.forEach((skill) => {
    skillsRow.appendChild(
      el(
        "span",
        {
          color: GOLD,
          fontSize: "19px",
          fontWeight: "500",
          whiteSpace: "nowrap",
          textDecoration: "underline",
          textDecorationColor: GOLD,
          textUnderlineOffset: "6px",
        },
        skill.name
      )
    );
  });

  footer.appendChild(skillsRow);
  footer.appendChild(
    el(
      "div",
      { fontSize: "20px", color: MUTED, fontWeight: "700", whiteSpace: "nowrap", flexShrink: "0" },
      "codepersona.app"
    )
  );

  card.appendChild(header);
  card.appendChild(middle);
  card.appendChild(footer);

  return card;
}

export async function generateShareCardBlob(journey: JourneyData): Promise<Blob> {
  const html2canvas = (await import("html2canvas")).default;
  const card = buildCardElement(journey);
  document.body.appendChild(card);

  try {
    // Let the avatar (cross-origin) actually load before capturing, otherwise
    // html2canvas can render a blank circle.
    const img = card.querySelector("img");
    if (img && !img.complete) {
      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    }

    const canvas = await html2canvas(card, {
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      useCORS: true,
      backgroundColor: BG,
      scale: 2,
    });

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to render share card"));
      }, "image/png");
    });
  } finally {
    card.remove();
  }
}

export async function downloadShareCard(journey: JourneyData) {
  const blob = await generateShareCardBlob(journey);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${journey.github_username}-codepersona.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
