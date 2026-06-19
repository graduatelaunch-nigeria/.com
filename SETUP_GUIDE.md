# 🚀 Graduate Launch Nigeria - Complete Setup Guide

## **QUICK START (3 Simple Steps)**

### **Step 1: Install Dependencies**
Open your terminal in the project folder and run:
```bash
npm install
```

### **Step 2: Make Sure MongoDB is Running**
Make sure MongoDB is installed and running on your computer or use MongoDB Atlas (cloud).

### **Step 3: Start the Server**
```bash
npm start
```

You should see: `Server running on port 5000`

---

## **Access Your Website**

**Main Website:** http://localhost:5000/index.html

**Admin Dashboard:** http://localhost:5000/admin.html

---

## **What Each File Does**

| File | Purpose |
|------|---------|
| `server.js` | Backend server - manages all data |
| `admin.html` | Admin dashboard - manage opportunities |
| `admin-script.js` | Admin dashboard functions |
| `admin-style.css` | Admin dashboard styling |
| `index.html` | Main website |
| `script-backend.js` | Frontend code that talks to backend |
| `client.js` | API client for frontend |
| `.env` | Database settings |
| `package.json` | List of dependencies |

---

## **How to Use the Admin Dashboard**

### **Add an Opportunity**
1. Go to http://localhost:5000/admin.html
2. Click **"+ Add Opportunity"** button
3. Fill in the form:
   - **Title** - Name of opportunity
   - **Category** - Choose from dropdown
   - **Organization** - Company/University name
   - **Location** - Where it's based
   - **Deadline** - Application deadline
   - **Description** - What it's about
   - **Link** - Apply URL
   - **Featured** - Check to show on homepage
4. Click **"Save Opportunity"**

### **Edit an Opportunity**
1. Go to admin dashboard
2. Find the opportunity in the table
3. Click **"Edit"** button
4. Change details
5. Click **"Save Opportunity"**

### **Delete an Opportunity**
1. Go to admin dashboard
2. Find the opportunity
3. Click **"Delete"** button
4. Confirm deletion

### **View Subscribers**
1. Go to admin dashboard
2. Click **"Subscribers"** tab
3. See all newsletter subscribers

### **View Contact Messages**
1. Go to admin dashboard
2. Click **"Contact Messages"** tab
3. Click any message to view details
4. Change status and click "Update Status"

---

## **Your Website Features**

✅ **Homepage** - Display featured opportunities
✅ **Search** - Users can search opportunities
✅ **Categories** - Filter by type (internship, scholarship, etc.)
✅ **Newsletter** - Users can subscribe
✅ **Contact Form** - Users can send messages
✅ **Admin Dashboard** - You manage everything

---

## **Database**

Your `.env` file connects to MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/graduatelaunch
PORT=5000
```

If using MongoDB Atlas (cloud):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/graduatelaunch
PORT=5000
```

---

## **Troubleshooting**

**Problem:** "Cannot find module 'express'"
- **Solution:** Run `npm install` first

**Problem:** "MongoDB connection error"
- **Solution:** Make sure MongoDB is running or check your connection string in `.env`

**Problem:** Admin dashboard not loading
- **Solution:** Make sure server is running on port 5000

**Problem:** Opportunities not showing
- **Solution:** Make sure you added them in the admin dashboard

---

## **Commands You'll Use**

```bash
# Install all dependencies
npm install

# Start the server
npm start

# Stop the server
Ctrl + C
```

---

## **Everything is Ready!** ✅

Your website is now fully functional with:
- Frontend website (index.html)
- Backend server (server.js)
- MongoDB database
- Admin dashboard to manage content
- Newsletter subscription
- Contact form

**No hardcoded data needed - everything is managed through the admin dashboard!**

---

*Last Updated: June 19, 2026*
