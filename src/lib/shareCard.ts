import type { JourneyData } from "@/types/journey";

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

function buildCardElement(journey: JourneyData): HTMLDivElement {
  const { github_data, ai_persona, ai_skills } = journey;
  const { user } = github_data;
  const topSkills = (ai_skills?.skills ?? []).slice(0, 3);

  const card = document.createElement("div");
  card.style.width = `${CARD_WIDTH}px`;
  card.style.height = `${CARD_HEIGHT}px`;
  card.style.position = "fixed";
  card.style.left = "-9999px";
  card.style.top = "0";
  card.style.display = "flex";
  card.style.flexDirection = "column";
  card.style.justifyContent = "center";
  card.style.padding = "80px";
  card.style.background = "#141110";
  card.style.color = "#f5f2ee";
  card.style.fontFamily = "Inter, system-ui, sans-serif";
  card.style.boxSizing = "border-box";

  const topRow = document.createElement("div");
  topRow.style.display = "flex";
  topRow.style.alignItems = "center";
  topRow.style.gap = "32px";
  topRow.style.marginBottom = "48px";

  const avatar = document.createElement("img");
  avatar.src = user.avatar_url;
  avatar.crossOrigin = "anonymous";
  avatar.style.width = "140px";
  avatar.style.height = "140px";
  avatar.style.borderRadius = "9999px";
  avatar.style.objectFit = "cover";
  avatar.style.border = "3px solid rgba(200,168,105,0.4)";

  const identity = document.createElement("div");

  const name = document.createElement("div");
  name.textContent = user.name || journey.github_username;
  name.style.fontSize = "44px";
  name.style.fontWeight = "600";
  name.style.marginBottom = "8px";

  const handle = document.createElement("div");
  handle.textContent = `@${journey.github_username}`;
  handle.style.fontSize = "24px";
  handle.style.color = "#a8a29e";

  identity.appendChild(name);
  identity.appendChild(handle);
  topRow.appendChild(avatar);
  topRow.appendChild(identity);

  const personaTitle = document.createElement("div");
  if (ai_persona?.title) {
    personaTitle.textContent = ai_persona.title;
    personaTitle.style.fontSize = "36px";
    personaTitle.style.fontStyle = "italic";
    personaTitle.style.color = "#c8a869";
    personaTitle.style.marginBottom = "40px";
    personaTitle.style.maxWidth = "1000px";
  }

  const skillsRow = document.createElement("div");
  skillsRow.style.display = "flex";
  skillsRow.style.gap = "16px";
  skillsRow.style.flexWrap = "wrap";
  topSkills.forEach((skill) => {
    const pill = document.createElement("span");
    pill.textContent = skill.name;
    pill.style.padding = "12px 24px";
    pill.style.borderRadius = "9999px";
    pill.style.border = "1px solid rgba(200,168,105,0.3)";
    pill.style.background = "rgba(200,168,105,0.1)";
    pill.style.color = "#c8a869";
    pill.style.fontSize = "20px";
    pill.style.fontWeight = "500";
    skillsRow.appendChild(pill);
  });

  const footer = document.createElement("div");
  footer.textContent = "codepersona.app";
  footer.style.position = "absolute";
  footer.style.bottom = "40px";
  footer.style.right = "80px";
  footer.style.fontSize = "20px";
  footer.style.color = "#a8a29e";
  footer.style.fontWeight = "600";
  card.style.position = "fixed";

  card.appendChild(topRow);
  if (ai_persona?.title) card.appendChild(personaTitle);
  card.appendChild(skillsRow);
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
      backgroundColor: "#141110",
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
