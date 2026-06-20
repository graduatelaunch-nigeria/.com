/* =========================
   GRADUATE LAUNCH NIGERIA
   DATA.JS
   Shared by script.js (homepage) and opportunity.js (detail page).
   Handles loading + normalizing opportunities from the Google Sheet
   so both pages always agree on field names and IDs.
========================= */

/* ---- CONFIG ----
   Your Google Sheet ID (from the sheet's URL) and tab name.
   The sheet MUST be shared as "Anyone with the link can view"
   (or published to the web) for opensheet.elk.sh to read it. */
const SHEET_ID = "1ivBHTajPPYNvXn6mQpjL37j1kZHNliKZnmmULwcNkAg";
const SHEET_TAB = "Sheet1";
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_TAB}`;

/* ---- HELPERS ---- */

// Basic HTML escaping so stray characters typed into the sheet
// (quotes, < >, etc.) never break page layout.
function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Turns a title + organization into a URL-friendly slug.
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Splits a multi-line / semicolon / bullet separated sheet cell
// (e.g. a Requirements column) into a clean array of strings.
function splitListField(text) {
  if (!text) return [];
  return text
    .split(/\r?\n|;|•/)
    .map(s => s.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

/* ---- NORMALIZE SHEET ROWS ----
   Google Sheet column headers become the JSON keys.
   This accepts either "title" or "Title" style headers so small
   spelling/casing differences in your sheet don't break the site.
   usedSlugs lets us auto-generate a stable, collision-free ID for
   each row when the sheet doesn't have its own ID column. */
function normalizeItem(item, index, usedSlugs) {
  const title = item.title || item.Title || "Untitled Opportunity";
  const organization = item.organization || item.Organization || "";

  let id = item.id || item.ID || item.Id || "";
  if (!id) {
    id = slugify(`${title}-${organization}`) || `opportunity-${index}`;
    if (usedSlugs.has(id)) {
      id = `${id}-${index}`;
    }
  }
  usedSlugs.add(id);

  const featuredRaw = (item.featured || item.Featured || "")
    .toString()
    .trim()
    .toLowerCase();

  return {
    id,
    title,
    organization,
    location: item.location || item.Location || "",
    description: item.description || item.Description || "",
    requirements: item.requirements || item.Requirements || "",
    responsibilities: item.responsibilities || item.Responsibilities || "",
    benefits: item.benefits || item.Benefits || "",
    link: item.link || item.Link || "#",
    deadline: item.deadline || item.Deadline || "N/A",
    category: item.category || item.Category || "",
    featured: featuredRaw === "yes" || featuredRaw === "true"
  };
}

/* ---- FETCH + NORMALIZE EVERYTHING ---- */
async function fetchOpportunities() {
  const response = await fetch(SHEET_URL);
  if (!response.ok) {
    throw new Error(`Sheet request failed: ${response.status}`);
  }
  const rawData = await response.json();

  // Skip rows with no Title — these are blank/stray rows in the sheet,
  // not real opportunities, so they shouldn't render as "Untitled Opportunity" cards.
  const realRows = rawData.filter(item => {
    const title = (item.title || item.Title || "").toString().trim();
    return title !== "";
  });

  const usedSlugs = new Set();
  return realRows.map((item, index) => normalizeItem(item, index, usedSlugs));
}
