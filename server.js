const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Setup data storage (JSON files in project root)
const dataFile = path.join(__dirname, 'leads.json');
const plansFile = path.join(__dirname, 'plans.json');

// Initialize data files if they don't exist
function initializeDataFile() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ leads: [] }, null, 2));
  }
  if (!fs.existsSync(plansFile)) {
    fs.writeFileSync(plansFile, JSON.stringify({ plans: [] }, null, 2));
  }
}

initializeDataFile();

// Load leads from file
function loadLeads() {
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data).leads || [];
  } catch (err) {
    console.error('Error reading leads file:', err);
    return [];
  }
}

// Save leads to file
function saveLeads(leads) {
  try {
    fs.writeFileSync(dataFile, JSON.stringify({ leads }, null, 2));
  } catch (err) {
    console.error('Error writing leads file:', err);
  }
}

// Load plans from file
function loadPlans() {
  try {
    const data = fs.readFileSync(plansFile, 'utf-8');
    return JSON.parse(data).plans || [];
  } catch (err) {
    console.error('Error reading plans file:', err);
    return [];
  }
}

// Save plans to file
function savePlans(plans) {
  try {
    fs.writeFileSync(plansFile, JSON.stringify({ plans }, null, 2));
  } catch (err) {
    console.error('Error writing plans file:', err);
  }
}

// Setup Nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || '',
    pass: process.env.GMAIL_PASSWORD || ''
  }
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Simple health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Function to send email
async function sendEmailNotification(brandName, phone, email, plan = '', requirements = '') {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
      console.warn('Email credentials not configured. Skipping email notification.');
      return true;
    }

    // Email to company
    const companyMailOptions = {
      from: process.env.GMAIL_USER,
      to: 'promotewithus6@gmail.com',
      subject: 'New Lead Submission - Promote With Us',
      html: `
        <h2>New Lead Received</h2>
        <p><strong>Brand/Business Name:</strong> ${escapeHtml(brandName)}</p>
        <p><strong>Contact Number:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email Address:</strong> ${escapeHtml(email)}</p>
        ${plan ? `<p><strong>Selected Plan:</strong> ${escapeHtml(plan)}</p>` : ''}
        ${requirements ? `<p><strong>Requirements/Notes:</strong></p><p>${escapeHtml(requirements).replace(/\n/g, '<br>')}</p>` : ''}
        <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    // Email to user (confirmation)
    const userMailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Thank You! We Received Your Request - Promote With Us',
      html: `
        <h2>Thank You for Your Interest! 🎉</h2>
        <p>Hi <strong>${escapeHtml(brandName)}</strong>,</p>
        <p>We have successfully received your inquiry and will get back to you shortly.</p>
        <h3>Your Details:</h3>
        <p><strong>Company Name:</strong> ${escapeHtml(brandName)}</p>
        <p><strong>Contact Number:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email Address:</strong> ${escapeHtml(email)}</p>
        ${plan ? `<p><strong>Selected Plan:</strong> ${escapeHtml(plan)}</p>` : ''}
        ${requirements ? `<p><strong>Your Requirements:</strong></p><p>${escapeHtml(requirements).replace(/\n/g, '<br>')}</p>` : ''}
        <p><strong>Submission Time:</strong> ${new Date().toLocaleString()}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
        <p>Our team will contact you within 24 hours to discuss your project and provide a detailed quote.</p>
        <p>If you have any immediate questions, feel free to reply to this email or call us.</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          <strong>Promote With Us</strong><br>
          Transforming businesses from offline to online<br>
          <a href="https://promotewithus.com" style="color: #20c5b5; text-decoration: none;">Visit our website</a>
        </p>
      `
    };

    await transporter.sendMail(companyMailOptions);
    console.log(`Email sent successfully to promotewithus6@gmail.com for lead: ${brandName}`);
    
    await transporter.sendMail(userMailOptions);
    console.log(`Confirmation email sent successfully to ${email}`);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't fail the request if email fails, just log it
    return false;
  }
}

// Helper to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// API endpoint to receive leads
app.post('/api/lead', (req, res) => {
  const { brandName, phone, email, plan, requirements } = req.body;
  if (!brandName || !phone || !email) {
    return res.status(400).json({ success: false, message: 'brandName, phone and email are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
  }

  // Validate phone (at least 6 characters, can contain numbers, +, -, (), spaces)
  const phoneRegex = /^[0-9+\-() ]{6,20}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ success: false, message: 'Please provide a valid phone number' });
  }

  try {
    const leads = loadLeads();
    const newLead = {
      id: leads.length + 1,
      brand_name: brandName,
      phone: phone,
      email: email,
      plan: plan || 'Not specified',
      requirements: requirements || '',
      created_at: new Date().toISOString()
    };
    
    leads.push(newLead);
    saveLeads(leads);
    
    // Send email notifications to both company and user
    sendEmailNotification(brandName, phone, email, plan, requirements);
    
    return res.json({ success: true, id: newLead.id });
  } catch (err) {
    console.error('Error saving lead:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Basic auth middleware for admin routes (development use)
function basicAuth(req, res, next) {
  const auth = req.headers['authorization'];
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASS || 'ACDS@123';

  if (!auth) {
    return res.status(401).json({ authenticated: false, message: 'Authentication required' });
  }

  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Basic') {
    return res.status(400).json({ authenticated: false, message: 'Bad authorization header' });
  }

  const decoded = Buffer.from(parts[1], 'base64').toString();
  const [user, pass] = decoded.split(':');
  
  console.log('Auth attempt - User:', user, 'Expected:', adminUser, 'Pass match:', pass === adminPass);
  
  if (user === adminUser && pass === adminPass) return next();

  return res.status(401).json({ authenticated: false, message: 'Invalid credentials' });
}

// Authentication endpoint (protected by basic auth)
app.get('/api/auth/check', basicAuth, (req, res) => {
  res.json({ authenticated: true, message: 'Authentication successful' });
});

// Admin interface to view leads (protected by basic auth)
app.get('/admin', basicAuth, (req, res) => {
  const rows = loadLeads();

  let html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Leads - Admin</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;background:#f6f8fb}table{border-collapse:collapse;width:100%;background:#fff}th,td{padding:10px;border:1px solid #e6e9ef;text-align:left}th{background:#164069;color:#fff}h1{color:#164069}</style></head><body><h1>Leads</h1><p>Showing latest ${rows.length} leads</p><table><thead><tr><th>ID</th><th>Brand</th><th>Phone</th><th>Email</th><th>Created At</th></tr></thead><tbody>`;
  rows.reverse().slice(0, 1000).forEach(r => {
    html += `<tr><td>${r.id}</td><td>${escapeHtml(r.brand_name)}</td><td>${escapeHtml(r.phone)}</td><td>${escapeHtml(r.email)}</td><td>${r.created_at}</td></tr>`;
  });
  html += `</tbody></table></body></html>`;
  res.send(html);
});

// JSON endpoint for leads (also protected)
app.get('/admin/leads.json', basicAuth, (req, res) => {
  const rows = loadLeads();
  const leads = rows.map(r => ({
    id: r.id,
    brandName: r.brand_name,
    phone: r.phone,
    email: r.email,
    plan: r.plan || 'Not specified',
    created_at: r.created_at
  })).reverse();
  
  res.json({ leads });
});

// Public leads endpoint (for dashboard - no auth required)
app.get('/api/leads', (req, res) => {
  const rows = loadLeads();
  const leads = rows.map(r => ({
    id: r.id,
    brandName: r.brand_name,
    phone: r.phone,
    email: r.email,
    plan: r.plan || 'Not specified',
    requirements: r.requirements || '',
    created_at: r.created_at
  })).reverse();
  
  res.json({ leads });
});

// API endpoint to add a new plan (protected by basic auth)
app.post('/api/plans', basicAuth, (req, res) => {
  const { category, tier, name, price, description, features, deliveryTime, idealFor } = req.body;
  
  if (!category || !tier || !name || !price) {
    return res.status(400).json({ success: false, message: 'category, tier, name, and price are required' });
  }

  try {
    const plans = loadPlans();
    const newPlan = {
      id: plans.length + 1,
      category: category,
      tier: tier,
      name: name,
      price: price,
      description: description || '',
      features: features || [],
      deliveryTime: deliveryTime || '',
      idealFor: idealFor || '',
      created_at: new Date().toISOString()
    };
    
    plans.push(newPlan);
    savePlans(plans);
    
    return res.json({ success: true, id: newPlan.id, plan: newPlan });
  } catch (err) {
    console.error('Error saving plan:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

// API endpoint to get all plans (public)
app.get('/api/plans', (req, res) => {
  const plans = loadPlans();
  
  // Group plans by category
  const groupedPlans = {};
  plans.forEach(plan => {
    if (!groupedPlans[plan.category]) {
      groupedPlans[plan.category] = [];
    }
    groupedPlans[plan.category].push(plan);
  });
  
  res.json({ plans: groupedPlans, allPlans: plans });
});

// API endpoint to delete a plan (protected by basic auth)
app.delete('/api/plans/:id', basicAuth, (req, res) => {
  const planId = parseInt(req.params.id);
  
  try {
    let plans = loadPlans();
    const initialLength = plans.length;
    plans = plans.filter(p => p.id !== planId);
    
    if (plans.length === initialLength) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    savePlans(plans);
    return res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (err) {
    console.error('Error deleting plan:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

// API endpoint to edit a plan (protected by basic auth)
app.put('/api/plans/:id', basicAuth, (req, res) => {
  const planId = parseInt(req.params.id);
  const { category, tier, name, price, description, features, deliveryTime, idealFor } = req.body;
  
  if (!category || !tier || !name || !price) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided' });
  }

  try {
    let plans = loadPlans();
    const planIndex = plans.findIndex(p => p.id === planId);
    
    if (planIndex === -1) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }
    
    plans[planIndex] = {
      ...plans[planIndex],
      category: category,
      tier: tier,
      name: name,
      price: price,
      description: description || '',
      features: features || plans[planIndex].features || [],
      deliveryTime: deliveryTime || plans[planIndex].deliveryTime || '',
      idealFor: idealFor || plans[planIndex].idealFor || '',
      updated_at: new Date().toISOString()
    };
    
    savePlans(plans);
    return res.json({ success: true, plan: plans[planIndex] });
  } catch (err) {
    console.error('Error updating plan:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

// Generic error handler: if an error bubbles up, return JSON for API routes
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (req.path && req.path.startsWith('/api')) {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
  // For non-API routes, delegate to default error handler
  next(err);
});
