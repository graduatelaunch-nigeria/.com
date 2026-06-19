/* =========================
   GRADUATE LAUNCH NIGERIA
   SCRIPT WITH BACKEND API
========================= */

let allOpportunities = [];

/* ==================== INITIALIZATION ==================== */

document.addEventListener('DOMContentLoaded', async () => {
  await loadAllOpportunities();
  await loadFeaturedOpportunities();
  setupEventListeners();
});

/* ==================== LOAD OPPORTUNITIES ==================== */

async function loadAllOpportunities() {
  try {
    allOpportunities = await OpportunitiesAPI.getAll();
    renderLatest(allOpportunities);
  } catch (error) {
    console.error('Error loading opportunities:', error);
    showMessage('latestContainer', 'Failed to load opportunities');
  }
}

async function loadFeaturedOpportunities() {
  try {
    const featured = await OpportunitiesAPI.getFeatured();
    renderFeatured(featured);
  } catch (error) {
    console.error('Error loading featured opportunities:', error);
    showMessage('featuredContainer', 'Failed to load featured opportunities');
  }
}

/* ==================== RENDER OPPORTUNITIES ==================== */

function createCard(item) {
  return `
    <div class="opportunity-card">
      <span class="deadline">
        Deadline: ${item.deadline}
      </span>

      <h3>${item.title}</h3>

      <p class="company">
        ${item.organization}
      </p>

      <p class="location">
        📍 ${item.location}
      </p>

      <p>
        ${item.description}
      </p>

      <a
        href="${item.link}"
        class="btn-primary"
        rel="noopener noreferrer"
        target="_blank">
        Apply Now
      </a>
    </div>
  `;
}

function renderFeatured(opportunities) {
  const container = document.getElementById('featuredContainer');
  if (!container) return;

  container.innerHTML = '';
  opportunities.forEach(item => {
    container.innerHTML += createCard(item);
  });

  // Trigger fade-in animation
  animateElements();
}

function renderLatest(opportunities) {
  const container = document.getElementById('latestContainer');
  if (!container) return;

  container.innerHTML = '';
  if (opportunities.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No opportunities found.</p>';
    return;
  }

  opportunities.forEach(item => {
    container.innerHTML += createCard(item);
  });

  // Trigger fade-in animation
  animateElements();
}

function showMessage(containerId, message) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px;">${message}</p>`;
  }
}

/* ==================== SETUP EVENT LISTENERS ==================== */

function setupEventListeners() {
  setupSearch();
  setupCategoryFilter();
  setupMobileMenu();
  setupNewsletterForm();
  setupContactForm();
  setupBackToTop();
  setupFadeInAnimation();
}

/* ==================== SEARCH ==================== */

function setupSearch() {
  const searchInput = document.getElementById('searchInput');

  if (searchInput) {
    searchInput.addEventListener('keyup', async (e) => {
      const keyword = searchInput.value.toLowerCase();

      if (keyword.length === 0) {
        renderLatest(allOpportunities);
        return;
      }

      const filtered = allOpportunities.filter(item =>
        item.title.toLowerCase().includes(keyword) ||
        item.organization.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword)
      );

      renderLatest(filtered);
    });
  }
}

/* ==================== CATEGORY FILTER ==================== */

function setupCategoryFilter() {
  const categoryCards = document.querySelectorAll('.category-card');

  categoryCards.forEach(card => {
    card.addEventListener('click', async () => {
      const category = card.dataset.category;
      const filtered = allOpportunities.filter(item => item.category === category);
      renderLatest(filtered);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/* ==================== MOBILE MENU ==================== */

function setupMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('#nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive);
    });

    document.querySelectorAll('#nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }
}

/* ==================== NEWSLETTER FORM ==================== */

function setupNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const message = document.getElementById('newsletterMessage');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('subscriberName').value.trim();
      const email = document.getElementById('subscriberEmail').value.trim();

      // Validation
      if (!name || !email) {
        showFormMessage(message, '❌ Please complete all fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage(message, '❌ Please enter a valid email address.', 'error');
        return;
      }

      try {
        await NewsletterAPI.subscribe(name, email);
        showFormMessage(message, '✅ Subscription successful! Check your email.', 'success');
        form.reset();

        setTimeout(() => {
          message.innerHTML = '';
          message.className = '';
        }, 5000);
      } catch (error) {
        showFormMessage(message, `❌ ${error.message}`, 'error');
      }
    });
  }
}

/* ==================== CONTACT FORM ==================== */

function setupContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('contactStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      // Validation
      if (!name || !email || !message) {
        showFormMessage(status, '❌ Please complete all fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage(status, '❌ Please enter a valid email address.', 'error');
        return;
      }

      try {
        await ContactAPI.send(name, email, message);
        showFormMessage(status, '✅ Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();

        setTimeout(() => {
          status.innerHTML = '';
          status.className = '';
        }, 5000);
      } catch (error) {
        showFormMessage(status, `❌ ${error.message}`, 'error');
      }
    });
  }
}

/* ==================== HELPER FUNCTIONS ==================== */

function showFormMessage(element, text, type) {
  if (!element) return;
  element.innerHTML = text;
  element.className = type === 'success' ? 'success-message' : 'error-message';
}

/* ==================== BACK TO TOP ==================== */

function setupBackToTop() {
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.display = window.scrollY > 400 ? 'block' : 'none';
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==================== FADE-IN ANIMATION ==================== */

function setupFadeInAnimation() {
  animateElements();
}

function animateElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0px)';
      }
    });
  });

  document.querySelectorAll('.category-card, .tip-card, .opportunity-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 0.8s ease';
    observer.observe(el);
  });
}
