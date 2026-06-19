/* =========================
   API CLIENT FOR FRONTEND
   Handles all backend requests
========================= */

const API_URL = 'http://localhost:5000/api';

// ==================== OPPORTUNITIES ====================

const OpportunitiesAPI = {
  // Get all opportunities
  async getAll(category = null, search = null) {
    try {
      let url = `${API_URL}/opportunities`;
      const params = new URLSearchParams();

      if (category) params.append('category', category);
      if (search) params.append('search', search);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch opportunities');
      return await response.json();
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      return [];
    }
  },

  // Get featured opportunities
  async getFeatured() {
    try {
      const response = await fetch(`${API_URL}/opportunities/featured`);
      if (!response.ok) throw new Error('Failed to fetch featured opportunities');
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured opportunities:', error);
      return [];
    }
  },

  // Get single opportunity
  async getById(id) {
    try {
      const response = await fetch(`${API_URL}/opportunities/${id}`);
      if (!response.ok) throw new Error('Opportunity not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      return null;
    }
  },

  // Create new opportunity (admin)
  async create(opportunityData) {
    try {
      const response = await fetch(`${API_URL}/opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportunityData)
      });

      if (!response.ok) throw new Error('Failed to create opportunity');
      return await response.json();
    } catch (error) {
      console.error('Error creating opportunity:', error);
      throw error;
    }
  },

  // Update opportunity (admin)
  async update(id, opportunityData) {
    try {
      const response = await fetch(`${API_URL}/opportunities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportunityData)
      });

      if (!response.ok) throw new Error('Failed to update opportunity');
      return await response.json();
    } catch (error) {
      console.error('Error updating opportunity:', error);
      throw error;
    }
  },

  // Delete opportunity (admin)
  async delete(id) {
    try {
      const response = await fetch(`${API_URL}/opportunities/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete opportunity');
      return await response.json();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      throw error;
    }
  }
};

// ==================== NEWSLETTER ====================

const NewsletterAPI = {
  // Subscribe to newsletter
  async subscribe(name, email) {
    try {
      const response = await fetch(`${API_URL}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      return data;
    } catch (error) {
      console.error('Error subscribing:', error);
      throw error;
    }
  },

  // Get all subscribers (admin only)
  async getAll() {
    try {
      const response = await fetch(`${API_URL}/subscribers`);
      if (!response.ok) throw new Error('Failed to fetch subscribers');
      return await response.json();
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      return [];
    }
  }
};

// ==================== CONTACT ====================

const ContactAPI = {
  // Send contact message
  async send(name, email, message) {
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Message failed to send');
      }

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Get all contact messages (admin only)
  async getAll() {
    try {
      const response = await fetch(`${API_URL}/contact`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  },

  // Update message status (admin)
  async updateStatus(id, status) {
    try {
      const response = await fetch(`${API_URL}/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update message status');
      return await response.json();
    } catch (error) {
      console.error('Error updating message status:', error);
      throw error;
    }
  }
};
