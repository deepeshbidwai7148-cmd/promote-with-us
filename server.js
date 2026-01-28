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
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  const rows = loadLeads();
  const leads = rows.map(r => ({
    id: r.id,
    brandName: r.brand_name,
    phone: r.phone,
    email: r.email,
    plan: r.plan || 'Not specified',
    requirements: r.requirements || '',
    remark: r.remark || 'Pending',
    username: r.username || null,
    password: r.password || null,
    description: r.description || '',
    descriptionUpdateRequests: r.descriptionUpdateRequests || [],
    created_at: r.created_at,
    planStartDate: r.planStartDate || null,
    planEndDate: r.planEndDate || null,
    approvedBy: r.approvedBy || null
  })).reverse();
  
  res.json({ leads });
});

// API endpoint to update lead remark status
app.put('/api/lead/:id/remark', (req, res) => {
  const leadId = parseInt(req.params.id);
  const { remark, approvedBy } = req.body;

  if (!remark || !['Pending', 'Approved', 'Rejected'].includes(remark)) {
    return res.status(400).json({ success: false, message: 'Invalid remark. Must be Pending, Approved, or Rejected.' });
  }

  try {
    const leads = loadLeads();
    let leadIndex = leads.findIndex(l => l.id === leadId);

    if (leadIndex === -1) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Update the remark (no longer delete rejected leads)
    leads[leadIndex].remark = remark;
    // Store admin username if approving
    if (remark === 'Approved' && approvedBy) {
      leads[leadIndex].approvedBy = approvedBy;
    }

    saveLeads(leads);
    return res.json({ success: true, message: `Lead marked as ${remark}` });
  } catch (err) {
    console.error('Error updating lead remark:', err);
    return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});

// API endpoint to update lead data (edit user info, plans, dates)
app.put('/api/lead/:id', (req, res) => {
  const leadId = parseInt(req.params.id);
  const { brandName, phone, email, plan, requirements, description, planStartDate, planEndDate } = req.body;

  try {
    const leads = loadLeads();
    const leadIndex = leads.findIndex(l => l.id === leadId);

    if (leadIndex === -1) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Update all provided fields
    if (brandName) leads[leadIndex].brand_name = brandName;
    if (phone) leads[leadIndex].phone = phone;
    if (email) leads[leadIndex].email = email;
    if (plan) leads[leadIndex].plan = plan;
    if (requirements) leads[leadIndex].requirements = requirements;
    if (description !== undefined) leads[leadIndex].description = description;
    if (planStartDate) leads[leadIndex].planStartDate = planStartDate;
    if (planEndDate) leads[leadIndex].planEndDate = planEndDate;

    saveLeads(leads);
    return res.json({ success: true, message: 'Lead updated successfully' });
  } catch (err) {
    console.error('Error updating lead:', err);
    return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});

// API endpoint to submit description update request
app.post('/api/lead/:id/description-update-request', (req, res) => {
  const leadId = parseInt(req.params.id);
  const { updateRequest, currentDescription, brandName, email } = req.body;

  if (!updateRequest) {
    return res.status(400).json({ success: false, message: 'Update request is required' });
  }

  try {
    const leads = loadLeads();
    const leadIndex = leads.findIndex(l => l.id === leadId);

    if (leadIndex === -1) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Initialize descriptionUpdateRequests array if it doesn't exist
    if (!leads[leadIndex].descriptionUpdateRequests) {
      leads[leadIndex].descriptionUpdateRequests = [];
    }

    // Add new update request
    const newRequest = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      updateRequest: updateRequest,
      currentDescription: currentDescription,
      status: 'Pending'
    };

    leads[leadIndex].descriptionUpdateRequests.push(newRequest);
    saveLeads(leads);

    // Send email notification to admin (non-blocking)
    try {
      if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
        const mailOptions = {
          from: process.env.GMAIL_USER || '',
          to: process.env.GMAIL_USER || '',
          subject: `📝 Description Update Request - ${brandName || 'User'}`,
          html: `
            <h2>New Description Update Request</h2>
            <p><strong>From:</strong> ${brandName || 'N/A'}</p>
            <p><strong>Email:</strong> ${email || 'N/A'}</p>
            <hr>
            <h3>Current Description:</h3>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; white-space: pre-wrap;">
              ${currentDescription || 'No description available'}
            </div>
            <h3>Requested Changes:</h3>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; white-space: pre-wrap;">
              ${updateRequest}
            </div>
            <hr>
            <p>Please review this request in the admin dashboard.</p>
          `
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.error('Error sending update request email:', err);
          } else {
            console.log('Update request email sent:', info.response);
          }
        });
      }
    } catch (emailErr) {
      console.error('Email sending error (non-critical):', emailErr);
      // Don't fail the request if email fails
    }

    return res.json({ success: true, message: 'Description update request submitted successfully' });
  } catch (err) {
    console.error('Error submitting description update request:', err);
    return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});

// API endpoint to update description update request status
app.put('/api/lead/:id/description-update-request/:requestId', (req, res) => {
  const leadId = parseInt(req.params.id);
  const requestId = req.params.requestId;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  try {
    const leads = loadLeads();
    const leadIndex = leads.findIndex(l => l.id === leadId);

    if (leadIndex === -1) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (!leads[leadIndex].descriptionUpdateRequests) {
      return res.status(404).json({ success: false, message: 'No update requests found' });
    }

    // Find and update the request
    const requestIndex = leads[leadIndex].descriptionUpdateRequests.findIndex(r => r.id == requestId);
    if (requestIndex === -1) {
      return res.status(404).json({ success: false, message: 'Update request not found' });
    }

    leads[leadIndex].descriptionUpdateRequests[requestIndex].status = status;
    leads[leadIndex].descriptionUpdateRequests[requestIndex].resolvedAt = new Date().toISOString();

    saveLeads(leads);
    return res.json({ success: true, message: 'Update request status updated successfully' });
  } catch (err) {
    console.error('Error updating request status:', err);
    return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});

// API endpoint to delete a lead
app.delete('/api/lead/:id', (req, res) => {
  const leadId = parseInt(req.params.id);

  try {
    const leads = loadLeads();
    const leadIndex = leads.findIndex(l => l.id === leadId);

    if (leadIndex === -1) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    leads.splice(leadIndex, 1);
    saveLeads(leads);
    return res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    console.error('Error deleting lead:', err);
    return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});

// API endpoint to generate and store credentials for approved leads
app.post('/api/lead/:id/credentials', (req, res) => {
  const leadId = parseInt(req.params.id);
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const leads = loadLeads();
    const lead = leads.find(l => l.id === leadId);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    if (lead.remark !== 'Approved') {
      return res.status(400).json({ success: false, message: 'Can only generate credentials for approved leads' });
    }

    // Check if username is unique
    const usernameExists = leads.some(l => l.id !== leadId && l.username && l.username.toLowerCase() === username.toLowerCase());
    if (usernameExists) {
      return res.status(400).json({ success: false, message: 'Username already exists. Please choose a different username.' });
    }

    // Store credentials
    lead.username = username;
    lead.password = password;

    saveLeads(leads);
    
    // Optionally send credentials via email
    if (email) {
      const mailOptions = {
        from: process.env.GMAIL_USER || '',
        to: email,
        subject: '🎉 Your Account Credentials - Promote With Us',
        html: `
          <h2>Welcome!</h2>
          <p>Your account has been approved. Here are your login credentials:</p>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Password:</strong> ${password}</p>
          <p>Please keep these credentials safe and change your password after first login.</p>
          <br>
          <p>Best regards,<br>Promote With Us Team</p>
        `
      };
      
      if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) console.error('Error sending credentials email:', err);
          else console.log('Credentials email sent:', info.response);
        });
      }
    }

    return res.json({ success: true, message: 'Credentials generated and stored', username, password });
  } catch (err) {
    console.error('Error generating credentials:', err);
    return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});

// API endpoint to add a new plan (frontend auth is handled by login page)
app.post('/api/plans', (req, res) => {
  const { category, tier, name, price, originalRate, offerPercentage, description, features, deliveryTime, idealFor } = req.body;
  
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
      originalRate: originalRate || '',
      offerPercentage: offerPercentage || '',
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
    return res.status(500).json({ success: false, message: 'Database error: ' + err.message });
  }
});

// API endpoint to get all plans (public - but check auth if header present)
app.get('/api/plans', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.set('Pragma', 'no-cache');
  // Check if auth header is present, if so validate it
  const auth = req.headers['authorization'];
  if (auth) {
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASS || 'password';
    const parts = auth.split(' ');
    if (parts.length === 2 && parts[0] === 'Basic') {
      const decoded = Buffer.from(parts[1], 'base64').toString();
      const [user, pass] = decoded.split(':');
      if (user !== adminUser || pass !== adminPass) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Leads Admin"');
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  }

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

// API endpoint to delete a plan
app.delete('/api/plans/:id', (req, res) => {
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

// API endpoint to edit a plan
app.put('/api/plans/:id', (req, res) => {
  const planId = parseInt(req.params.id);
  const { category, tier, name, price, originalRate, offerPercentage, description, features, deliveryTime, idealFor } = req.body;
  
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
      originalRate: originalRate || plans[planIndex].originalRate || '',
      offerPercentage: offerPercentage || plans[planIndex].offerPercentage || '',
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
