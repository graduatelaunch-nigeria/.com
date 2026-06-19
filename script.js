/* =========================
   GRADUATE LAUNCH NIGERIA
   SCRIPT.JS
   Pure static-site script — no backend.
   Opportunities are loaded live from a published Google Sheet.
========================= */

/* ---- CONFIG ---- */
// Your Google Sheet ID (from the sheet's URL) and tab name.
// The sheet MUST be shared as "Anyone with the link can view"
// (or published to the web) for opensheet.elk.sh to read it.
const SHEET_ID = "1ivBHTajPPYNvXn6mQpjL37j1kZHNliKZnmmULwcNkAg";
const SHEET_TAB = "Sheet1";
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_TAB}`;

/* ---- STATE ---- */
let allOpportunities = []; // populated once the sheet loads

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

/* ---- NORMALIZE SHEET ROWS ----
   Google Sheet column headers become the JSON keys.
   This accepts either "title" or "Title" style headers
   so small spelling/casing differences in your sheet don't break the site. */
function normalizeItem(item) {
  return {
    title: item.title || item.Title || "Untitled Opportunity",
    organization: item.organization || item.Organization || "",
    location: item.location || item.Location || "",
    description: item.description || item.Description || "",
    link: item.link || item.Link || "#",
    deadline: item.deadline || item.Deadline || "N/A",
    category: item.category || item.Category || ""
  };
}

/* ---- CARD TEMPLATE ---- */
function createCard(item) {
  return `
    <div class="opportunity-card">
      <span class="deadline">Deadline: ${item.deadline}</span>
      <h3>${item.title}</h3>
      <p class="company">${item.organization}</p>
      <p class="location">📍 ${item.location}</p>
      <p>${item.description}</p>
      <br>
      <a href="${item.link}" class="btn-primary" rel="noopener noreferrer" target="_blank">
        Apply Now
      </a>
    </div>
  `;
}

/* ---- RENDER FUNCTIONS ---- */
function renderFeatured(data) {
  if (!featuredContainer) return;
  featuredContainer.innerHTML = data.length
    ? data.slice(0, 6).map(createCard).join("")
    : `<p>No opportunities found.</p>`;
  applyFadeIn(featuredContainer);
}

function renderLatest(data) {
  if (!latestContainer) return;
  latestContainer.innerHTML = data.length
    ? data.map(createCard).join("")
    : `<p>No opportunities found.</p>`;
  applyFadeIn(latestContainer);
}

/* ---- LOAD FROM GOOGLE SHEET ---- */
async function loadOpportunities() {
  if (featuredContainer) featuredContainer.innerHTML = "<p>Loading opportunities...</p>";
  if (latestContainer) latestContainer.innerHTML = "<p>Loading opportunities...</p>";

  try {
    const response = await fetch(SHEET_URL);

    if (!response.ok) {
      throw new Error(`Sheet request failed: ${response.status}`);
    }

    const rawData = await response.json();
    allOpportunities = rawData.map(normalizeItem);

    renderFeatured(allOpportunities);
    renderLatest(allOpportunities);

  } catch (error) {
    console.error(error);
    const message = `<p>Unable to load opportunities right now. Please check back later.</p>`;
    if (featuredContainer) featuredContainer.innerHTML = message;
    if (latestContainer) latestContainer.innerHTML = message;
  }
}

/* ---- SEARCH ---- */
if (searchInput) {
  searchInput.addEventListener("keyup", () => {
    const keyword = searchInput.value.toLowerCase();

    const filtered = allOpportunities.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.organization.toLowerCase().includes(keyword) ||
      item.location.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword)
    );

    renderLatest(filtered);
  });
}

/* ---- CATEGORY FILTER ---- */
const categoryCards = document.querySelectorAll(".category-card");

function filterByCategory(category) {
  const filtered = allOpportunities.filter(item => item.category === category);
  renderLatest(filtered);
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
