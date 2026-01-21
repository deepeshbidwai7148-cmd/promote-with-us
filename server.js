const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Setup DB (file in project root)
const dbFile = path.join(__dirname, 'leads.db');
const db = new sqlite3.Database(dbFile);

// Create table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Simple health check
app.get('/health', (req, res) => res.json({ ok: true }));

// API endpoint to receive leads
app.post('/api/lead', (req, res) => {
  const { brandName, phone, email } = req.body;
  if (!brandName || !phone || !email) {
    return res.status(400).json({ success: false, message: 'brandName, phone and email are required' });
  }

  const stmt = db.prepare('INSERT INTO leads (brand_name, phone, email) VALUES (?, ?, ?)');
  stmt.run(brandName, phone, email, function(err) {
    if (err) {
      console.error('DB insert error', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    return res.json({ success: true, id: this.lastID });
  });
  stmt.finalize();
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
  db.all('SELECT id, brand_name, phone, email, created_at FROM leads ORDER BY created_at DESC LIMIT 1000', (err, rows) => {
    if (err) return res.status(500).send('DB error');

    let html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Leads - Admin</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,Helvetica,sans-serif;padding:20px;background:#f6f8fb}table{border-collapse:collapse;width:100%;background:#fff}th,td{padding:10px;border:1px solid #e6e9ef;text-align:left}th{background:#164069;color:#fff}h1{color:#164069}</style></head><body><h1>Leads</h1><p>Showing latest ${rows.length} leads</p><table><thead><tr><th>ID</th><th>Brand</th><th>Phone</th><th>Email</th><th>Created At</th></tr></thead><tbody>`;
    rows.forEach(r => {
      html += `<tr><td>${r.id}</td><td>${escapeHtml(r.brand_name)}</td><td>${escapeHtml(r.phone)}</td><td>${escapeHtml(r.email)}</td><td>${r.created_at}</td></tr>`;
    });
    html += `</tbody></table></body></html>`;
    res.send(html);
  });
});

// JSON endpoint for leads (also protected)
app.get('/admin/leads.json', basicAuth, (req, res) => {
  db.all('SELECT id, brand_name as brandName, phone, email, created_at FROM leads ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ leads: rows });
  });
});

// helper to escape HTML in admin table
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>\"]/g, function(s) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[s]; });
}

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
