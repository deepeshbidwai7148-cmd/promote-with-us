const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Setup data storage (JSON file in project root)
const dataFile = path.join(__dirname, 'leads.json');

// Initialize leads file if it doesn't exist
function initializeDataFile() {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify({ leads: [] }, null, 2));
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

// Simple health check
app.get('/health', (req, res) => res.json({ ok: true }));

// Function to send email
async function sendEmailNotification(brandName, phone, email) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASSWORD) {
      console.warn('Email credentials not configured. Skipping email notification.');
      return true;
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'promotewithus6@gmail.com',
      subject: 'New Lead Submission - Promote With Us',
      html: `
        <h2>New Lead Received</h2>
        <p><strong>Brand/Business Name:</strong> ${escapeHtml(brandName)}</p>
        <p><strong>Contact Number:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email Address:</strong> ${escapeHtml(email)}</p>
        <p><strong>Submitted At:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to promotewithus6@gmail.com for lead: ${brandName}`);
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
  const { brandName, phone, email } = req.body;
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
      created_at: new Date().toISOString()
    };
    
    leads.push(newLead);
    saveLeads(leads);
    
    // Send email notification
    sendEmailNotification(brandName, phone, email);
    
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
  const adminPass = process.env.ADMIN_PASS || 'password';

  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Leads Admin"');
    return res.status(401).send('Authentication required');
  }

  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Basic') {
    return res.status(400).send('Bad authorization header');
  }

  const decoded = Buffer.from(parts[1], 'base64').toString();
  const [user, pass] = decoded.split(':');
  if (user === adminUser && pass === adminPass) return next();

  res.setHeader('WWW-Authenticate', 'Basic realm="Leads Admin"');
  return res.status(401).send('Invalid credentials');
}

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
    created_at: r.created_at
  })).reverse();
  
  res.json({ leads });
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
