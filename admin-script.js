/* =========================
   ADMIN DASHBOARD SCRIPT
========================= */

const API_URL = 'http://localhost:5000/api';

let currentEditingId = null;
let currentMessageId = null;
let allMessages = [];

/* ==================== INITIALIZATION ==================== */

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  setupModals();
  await loadOpportunities();
  setupOpportunityForm();
  loadSubscribers();
  loadMessages();
  setupMessageFilter();
  setupLogout();
});

/* ==================== NAVIGATION ==================== */

function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;

      // Remove active from all links
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Hide all sections
      document.querySelectorAll('.admin-section').forEach(s => {
        s.classList.remove('active');
      });

      // Show selected section
      document.getElementById(`${section}-section`).classList.add('active');

      if (section === 'subscribers') {
        loadSubscribers();
      } else if (section === 'messages') {
        loadMessages();
      }
    });
  });
}

/* ==================== OPPORTUNITIES ==================== */

async function loadOpportunities() {
  showSpinner(true);
  try {
    const response = await fetch(`${API_URL}/opportunities`);
    const opportunities = await response.json();

    const tbody = document.getElementById('opportunitiesBody');
    const noData = document.getElementById('noOpportunities');

    if (opportunities.length === 0) {
      tbody.innerHTML = '';
      noData.style.display = 'block';
      return;
    }

    noData.style.display = 'none';
    tbody.innerHTML = opportunities.map(opp => `
      <tr>
        <td><strong>${opp.title}</strong></td>
        <td>${opp.organization}</td>
        <td>${opp.category}</td>
        <td>${opp.deadline}</td>
        <td>
          ${opp.featured ? '<span class="featured-badge">Featured</span>' : '-'}
        </td>
        <td>
          <button class="btn-edit btn-sm" onclick="editOpportunity('${opp._id}')">Edit</button>
          <button class="btn-danger btn-sm" onclick="deleteOpportunity('${opp._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Error loading opportunities:', error);
    alert('Failed to load opportunities');
  } finally {
    showSpinner(false);
  }
}

async function editOpportunity(id) {
  try {
    const response = await fetch(`${API_URL}/opportunities/${id}`);
    const opportunity = await response.json();

    currentEditingId = id;

    document.getElementById('oppTitle').value = opportunity.title;
    document.getElementById('oppCategory').value = opportunity.category;
    document.getElementById('oppOrganization').value = opportunity.organization;
    document.getElementById('oppLocation').value = opportunity.location;
    document.getElementById('oppDeadline').value = opportunity.deadline;
    document.getElementById('oppDescription').value = opportunity.description;
    document.getElementById('oppLink').value = opportunity.link;
    document.getElementById('oppFeatured').checked = opportunity.featured;
    document.getElementById('oppId').value = id;

    document.getElementById('modalTitle').textContent = 'Edit Opportunity';
    openModal('opportunityModal');
  } catch (error) {
    console.error('Error loading opportunity:', error);
    alert('Failed to load opportunity');
  }
}

async function deleteOpportunity(id) {
  if (!confirm('Are you sure you want to delete this opportunity?')) return;

  showSpinner(true);
  try {
    const response = await fetch(`${API_URL}/opportunities/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Failed to delete');

    alert('Opportunity deleted successfully');
    loadOpportunities();
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    alert('Failed to delete opportunity');
  } finally {
    showSpinner(false);
  }
}

/* ==================== OPPORTUNITY FORM ==================== */

function setupOpportunityForm() {
  const addBtn = document.getElementById('addOpportunityBtn');
  const form = document.getElementById('opportunityForm');
  const cancelBtn = document.getElementById('cancelBtn');

  addBtn.addEventListener('click', () => {
    currentEditingId = null;
    form.reset();
    document.getElementById('modalTitle').textContent = 'Add Opportunity';
    openModal('opportunityModal');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveOpportunity();
  });

  cancelBtn.addEventListener('click', () => {
    closeModal('opportunityModal');
  });
}

async function saveOpportunity() {
  showSpinner(true);
  try {
    const opportunityData = {
      title: document.getElementById('oppTitle').value,
      category: document.getElementById('oppCategory').value,
      organization: document.getElementById('oppOrganization').value,
      location: document.getElementById('oppLocation').value,
      deadline: document.getElementById('oppDeadline').value,
      description: document.getElementById('oppDescription').value,
      link: document.getElementById('oppLink').value,
      featured: document.getElementById('oppFeatured').checked
    };

    let url = `${API_URL}/opportunities`;
    let method = 'POST';

    if (currentEditingId) {
      url += `/${currentEditingId}`;
      method = 'PUT';
    }

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opportunityData)
    });

    if (!response.ok) throw new Error('Failed to save opportunity');

    alert(`Opportunity ${currentEditingId ? 'updated' : 'created'} successfully`);
    closeModal('opportunityModal');
    loadOpportunities();
  } catch (error) {
    console.error('Error saving opportunity:', error);
    alert('Failed to save opportunity');
  } finally {
    showSpinner(false);
  }
}

/* ==================== SUBSCRIBERS ==================== */

async function loadSubscribers() {
  showSpinner(true);
  try {
    const response = await fetch(`${API_URL}/subscribers`);
    const subscribers = await response.json();

    const tbody = document.getElementById('subscribersBody');
    const noData = document.getElementById('noSubscribers');

    if (subscribers.length === 0) {
      tbody.innerHTML = '';
      noData.style.display = 'block';
      return;
    }

    noData.style.display = 'none';
    tbody.innerHTML = subscribers.map(sub => {
      const date = new Date(sub.subscribedAt).toLocaleDateString();
      return `
        <tr>
          <td>${sub.name}</td>
          <td>${sub.email}</td>
          <td>${date}</td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Error loading subscribers:', error);
    alert('Failed to load subscribers');
  } finally {
    showSpinner(false);
  }
}

/* ==================== MESSAGES ==================== */

async function loadMessages() {
  showSpinner(true);
  try {
    const response = await fetch(`${API_URL}/contact`);
    allMessages = await response.json();
    renderMessages(allMessages);
  } catch (error) {
    console.error('Error loading messages:', error);
    alert('Failed to load messages');
  } finally {
    showSpinner(false);
  }
}

function renderMessages(messages) {
  const list = document.getElementById('messagesList');
  const noData = document.getElementById('noMessages');

  if (messages.length === 0) {
    list.innerHTML = '';
    noData.style.display = 'block';
    return;
  }

  noData.style.display = 'none';
  list.innerHTML = messages.map(msg => {
    const date = new Date(msg.createdAt).toLocaleDateString();
    const preview = msg.message.substring(0, 100) + (msg.message.length > 100 ? '...' : '');

    return `
      <div class="message-card" onclick="viewMessage('${msg._id}')">
        <div class="message-header">
          <div>
            <div class="message-from">${msg.name}</div>
            <div class="message-email">${msg.email}</div>
          </div>
          <span class="status-badge status-${msg.status}">${msg.status.toUpperCase()}</span>
        </div>
        <div class="message-preview">${preview}</div>
        <div class="message-footer">
          <span>${date}</span>
        </div>
      </div>
    `;
  }).join('');
}

function setupMessageFilter() {
  const filter = document.getElementById('statusFilter');
  filter.addEventListener('change', (e) => {
    const status = e.target.value;
    if (status) {
      const filtered = allMessages.filter(msg => msg.status === status);
      renderMessages(filtered);
    } else {
      renderMessages(allMessages);
    }
  });
}

function viewMessage(id) {
  const message = allMessages.find(m => m._id === id);
  if (!message) return;

  currentMessageId = id;

  const detail = document.getElementById('messageDetail');
  const date = new Date(message.createdAt).toLocaleString();

  detail.innerHTML = `
    <div style="margin-bottom: 20px;">
      <p><strong>From:</strong> ${message.name}</p>
      <p><strong>Email:</strong> ${message.email}</p>
      <p><strong>Date:</strong> ${date}</p>
    </div>
    <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
      <p><strong>Message:</strong></p>
      <p style="margin-top: 10px; line-height: 1.6;">${message.message}</p>
    </div>
  `;

  document.getElementById('messageStatus').value = message.status;
  document.getElementById('messageId').value = id;

  openModal('messageModal');
}

async function updateMessageStatus() {
  showSpinner(true);
  try {
    const status = document.getElementById('messageStatus').value;

    const response = await fetch(`${API_URL}/contact/${currentMessageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    if (!response.ok) throw new Error('Failed to update status');

    alert('Status updated successfully');
    closeModal('messageModal');
    loadMessages();
  } catch (error) {
    console.error('Error updating status:', error);
    alert('Failed to update status');
  } finally {
    showSpinner(false);
  }
}

/* ==================== MODALS ==================== */

function setupModals() {
  const oppModal = document.getElementById('opportunityModal');
  const msgModal = document.getElementById('messageModal');
  const closeOppBtn = document.getElementById('closeModal');
  const closeMsgBtn = document.getElementById('closeMessageModal');
  const closeMsgDetailBtn = document.getElementById('closeMessageDetailBtn');
  const saveStatusBtn = document.getElementById('saveStatusBtn');

  closeOppBtn.addEventListener('click', () => closeModal('opportunityModal'));
  closeMsgBtn.addEventListener('click', () => closeModal('messageModal'));
  closeMsgDetailBtn.addEventListener('click', () => closeModal('messageModal'));
  saveStatusBtn.addEventListener('click', updateMessageStatus);

  // Close on background click
  window.addEventListener('click', (e) => {
    if (e.target === oppModal) closeModal('opportunityModal');
    if (e.target === msgModal) closeModal('messageModal');
  });
}

function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

/* ==================== UTILITIES ==================== */

function showSpinner(show) {
  const spinner = document.getElementById('spinner');
  if (show) {
    spinner.classList.add('active');
  } else {
    spinner.classList.remove('active');
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      window.location.href = 'index.html';
    }
  });
}