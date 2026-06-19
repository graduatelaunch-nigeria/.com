/* =========================
   GRADUATE LAUNCH NIGERIA
   EXPRESS SERVER
========================= */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ==================== DATABASE CONNECTION ====================

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// ==================== SCHEMAS ====================

// Opportunity Schema
const OpportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  organization: { type: String, required: true },
  location: { type: String, required: true },
  deadline: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Opportunity = mongoose.model('Opportunity', OpportunitySchema);

// Newsletter Subscriber Schema
const SubscriberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now }
});

const Subscriber = mongoose.model('Subscriber', SubscriberSchema);

// Contact Message Schema
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'new' }, // new, read, replied
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

// ==================== OPPORTUNITIES ROUTES ====================

// Get all opportunities
app.get('/api/opportunities', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const opportunities = await Opportunity.find(filter).sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured opportunities
app.get('/api/opportunities/featured', async (req, res) => {
  try {
    const featured = await Opportunity.find({ featured: true }).limit(6);
    res.json(featured);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single opportunity
app.get('/api/opportunities/:id', async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json(opportunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create opportunity
app.post('/api/opportunities', async (req, res) => {
  try {
    const newOpportunity = new Opportunity(req.body);
    const saved = await newOpportunity.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update opportunity
app.put('/api/opportunities/:id', async (req, res) => {
  try {
    const updated = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete opportunity
app.delete('/api/opportunities/:id', async (req, res) => {
  try {
    const deleted = await Opportunity.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    res.json({ message: 'Opportunity deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== NEWSLETTER ROUTES ====================

// Subscribe to newsletter
app.post('/api/subscribe', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email required' });
    }

    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    subscriber = new Subscriber({ name, email });
    await subscriber.save();

    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all subscribers (admin)
app.get('/api/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CONTACT ROUTES ====================

// Send contact message
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all contact messages (admin)
app.get('/api/contact', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update contact message status (admin)
app.put('/api/contact/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
