/* =========================
   GRADUATE LAUNCH NIGERIA
   SCRIPT.JS (homepage)
   Pure static-site script — no backend.
   Opportunities are loaded live from a published Google Sheet.
   Shared loading/normalizing logic lives in data.js (loaded first).
========================= */

/* ---- STATE ---- */
let allOpportunities = []; // every opportunity, populated once the sheet loads

/* ---- DOM REFERENCES ---- */
const featuredContainer = document.getElementById("opportunitiesContainer");
const latestContainer = document.getElementById("latestContainer");
const searchInput = document.getElementById("searchInput");

/* ---- FADE-IN OBSERVER ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0px)";
    }
  });
});

function applyFadeIn(container) {
  if (!container) return;
  container.querySelectorAll(".opportunity-card").forEach(el => {
    el.style.opacity = 0;
    el.style.transform = "translateY(40px)";
    el.style.transition = "all 0.8s ease";
    observer.observe(el);
  });
}

// Short preview for the card grid — full text lives on the detail page.
function truncate(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/* ---- CARD TEMPLATE ---- */
function createCard(item) {
  const detailUrl = `opportunity.html?id=${encodeURIComponent(item.id)}`;
  return `
    <div class="opportunity-card">
      <div class="card-top">
        <span class="deadline">Deadline: ${escapeHTML(item.deadline)}</span>
        ${item.category ? `<span class="category-tag">${escapeHTML(item.category)}</span>` : ""}
      </div>
      <h3>${escapeHTML(item.title)}</h3>
      <p class="company">${escapeHTML(item.organization)}</p>
      <p class="location">📍 ${escapeHTML(item.location)}</p>
      <p class="card-desc">${escapeHTML(truncate(item.description, 120))}</p>
      <a href="${detailUrl}" class="btn-primary read-more-btn">
        Read More &raquo;
      </a>
    </div>
  `;
}

/* ---- SPLIT FEATURED VS LATEST (no more duplicates) ----
   Only items marked Featured = Yes in the sheet show in the
   Featured section (max 6). Everything else shows in Latest.
   Featured will simply be empty until you tag something. */
function splitFeaturedAndLatest(data) {
  const featured = data.filter(item => item.featured).slice(0, 6);
  const featuredIds = new Set(featured.map(item => item.id));
  const latest = data.filter(item => !featuredIds.has(item.id));
  return { featured, latest };
}

/* ---- RENDER FUNCTIONS ---- */
function renderFeatured(data) {
  if (!featuredContainer) return;
  featuredContainer.innerHTML = data.length
    ? data.map(createCard).join("")
    : `<p>No featured opportunities right now — check Latest Opportunities below.</p>`;
  applyFadeIn(featuredContainer);
}

function renderLatest(data, emptyMessage = "No opportunities found.") {
  if (!latestContainer) return;
  latestContainer.innerHTML = data.length
    ? data.map(createCard).join("")
    : `<p>${emptyMessage}</p>`;
  applyFadeIn(latestContainer);
}

/* ---- LOAD FROM GOOGLE SHEET ---- */
async function loadOpportunities() {
  if (featuredContainer) featuredContainer.innerHTML = "<p>Loading opportunities...</p>";
  if (latestContainer) latestContainer.innerHTML = "<p>Loading opportunities...</p>";

  try {
    allOpportunities = await fetchOpportunities();

    const { featured, latest } = splitFeaturedAndLatest(allOpportunities);
    renderFeatured(featured);
    renderLatest(latest);

  } catch (error) {
    console.error(error);
    const message = `<p>Unable to load opportunities right now. Please check back later.</p>`;
    if (featuredContainer) featuredContainer.innerHTML = message;
    if (latestContainer) latestContainer.innerHTML = message;
  }
}

/* ---- SEARCH ----
   Searches the full set and shows matches in Latest Opportunities,
   regardless of featured status, so nothing is hidden from search. */
if (searchInput) {
  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase().trim();

    if (!keyword) {
      const { latest } = splitFeaturedAndLatest(allOpportunities);
      renderLatest(latest);
      return;
    }

    const filtered = allOpportunities.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.organization.toLowerCase().includes(keyword) ||
      item.location.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
    );

    renderLatest(filtered, `No opportunities match "${searchInput.value.trim()}".`);
    latestContainer?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Pressing Enter / the mobile keyboard's arrow-search key: dismiss the
  // keyboard and scroll down so the (already-filtered) results are visible.
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchInput.blur();
      latestContainer?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

/* ---- CATEGORY FILTER ---- */
const categoryCards = document.querySelectorAll(".category-card");

function filterByCategory(category) {
  const target = category.trim().toLowerCase();
  const filtered = allOpportunities.filter(
    item => item.category.trim().toLowerCase() === target
  );
  renderLatest(filtered, `No "${category}" opportunities posted yet — check back soon.`);
  latestContainer?.scrollIntoView({ behavior: "smooth", block: "start" });
}

categoryCards.forEach(card => {
  card.addEventListener("click", () => {
    filterByCategory(card.dataset.category);
  });

  // Keyboard activation (Enter and Space)
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      filterByCategory(card.dataset.category);
    }
  });
});

/* ---- MOBILE MENU ---- */
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

/* ---- NEWSLETTER FORM ----
   Front-end validation only — there is no backend on a static site,
   so this does not actually send/store the email anywhere yet.
   See chat for static-friendly options if you want real submissions. */
const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("subscriberName").value.trim();
    const email = document.getElementById("subscriberEmail").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "" || email === "") {
      newsletterMessage.textContent = "Please complete all fields.";
      newsletterMessage.style.color = "yellow";
      return;
    }

    if (!emailRegex.test(email)) {
      newsletterMessage.textContent = "Please enter a valid email address.";
      newsletterMessage.style.color = "yellow";
      return;
    }

    newsletterMessage.textContent = "Subscription successful! Check your email.";
    newsletterMessage.style.color = "#4ade80";
    newsletterForm.reset();
  });
}

/* ---- CONTACT FORM ----
   Same note as above: validation only, no real backend to receive it yet. */
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name === "" || email === "" || message === "") {
      contactStatus.textContent = "Please complete all fields.";
      contactStatus.style.color = "red";
      return;
    }

    if (!emailRegex.test(email)) {
      contactStatus.textContent = "Please enter a valid email address.";
      contactStatus.style.color = "red";
      return;
    }

    contactStatus.textContent = "Message sent successfully! We'll get back to you soon.";
    contactStatus.style.color = "green";
    contactForm.reset();
  });
}

/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.style.display = window.scrollY > 400 ? "block" : "none";
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---- FADE-IN FOR STATIC ELEMENTS ---- */
document.querySelectorAll(".category-card, .tip-card").forEach(el => {
  el.style.opacity = 0;
  el.style.transform = "translateY(40px)";
  el.style.transition = "all 0.8s ease";
  observer.observe(el);
});

/* ---- INIT ---- */
loadOpportunities();
