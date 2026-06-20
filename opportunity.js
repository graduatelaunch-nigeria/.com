/* =========================
   GRADUATE LAUNCH NIGERIA
   OPPORTUNITY.JS
   Powers opportunity.html — renders one full opportunity based on
   the ?id= in the URL. Relies on data.js (loaded first) for
   fetchOpportunities() / escapeHTML() / splitListField().
========================= */

const params = new URLSearchParams(window.location.search);
const requestedId = params.get("id");
const detailContainer = document.getElementById("opportunityDetail");

function renderListSection(heading, rawText) {
  const items = splitListField(rawText);
  if (!items.length) return "";
  return `
    <section class="detail-section">
      <h2>${heading}</h2>
      <ul>
        ${items.map(i => `<li>${escapeHTML(i)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function renderDetail(item) {
  document.title = `${item.title} | Graduate Launch Nigeria`;

  detailContainer.innerHTML = `
    <a href="index.html" class="back-link">&laquo; Back to all opportunities</a>

    <article class="detail-card">
      <div class="detail-meta">
        <span class="deadline">Deadline: ${escapeHTML(item.deadline)}</span>
        ${item.category ? `<span class="category-tag">${escapeHTML(item.category)}</span>` : ""}
      </div>

      <h1>${escapeHTML(item.title)}</h1>
      <p class="company">${escapeHTML(item.organization)}</p>
      ${item.location ? `<p class="location">📍 ${escapeHTML(item.location)}</p>` : ""}

      ${item.description ? `
        <section class="detail-section">
          <h2>About this opportunity</h2>
          <p>${escapeHTML(item.description)}</p>
        </section>
      ` : ""}

      ${renderListSection("Requirements", item.requirements)}
      ${renderListSection("Responsibilities", item.responsibilities)}
      ${renderListSection("Benefits", item.benefits)}

      <a href="${item.link}" class="btn-primary apply-btn" target="_blank" rel="noopener noreferrer">
        Apply Now
      </a>
    </article>
  `;
}

function renderNotFound(message) {
  detailContainer.innerHTML = `
    <div class="detail-empty">
      <p>${message}</p>
      <a href="index.html" class="btn-primary">Browse all opportunities</a>
    </div>
  `;
}

async function loadDetail() {
  if (!requestedId) {
    renderNotFound("No opportunity was specified.");
    return;
  }

  detailContainer.innerHTML = `<p>Loading opportunity...</p>`;

  try {
    const data = await fetchOpportunities();
    const item = data.find(o => o.id === requestedId);

    if (!item) {
      renderNotFound("Sorry, we couldn't find that opportunity. It may have expired or been removed.");
      return;
    }

    renderDetail(item);
  } catch (error) {
    console.error(error);
    renderNotFound("Unable to load this opportunity right now. Please try again later.");
  }
}

/* ---- MOBILE MENU (same behavior as homepage) ---- */
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("#nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    const isActive = navMenu.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", isActive);
  });

  document.querySelectorAll("#nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      hamburger.setAttribute("aria-expanded", false);
    });
  });
}

loadDetail();
