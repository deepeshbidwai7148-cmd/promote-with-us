# Setup Instructions for Email Functionality

## Overview
This project now includes:
- ✅ Lead form on the "Start Now" page
- ✅ Form validation (email, phone, brand name)
- ✅ SQLite database for storing leads
- ✅ Email notifications sent to promotewithus6@gmail.com

## Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Gmail account with 2-Step Verification enabled

## Setup Steps

### 1. Install Dependencies
Run the following command in the project directory:
```bash
npm install
```

### 2. Configure Email (Gmail SMTP)

#### Step 1: Enable 2-Step Verification
- Go to https://myaccount.google.com/security
- Enable 2-Step Verification for your Gmail account

#### Step 2: Generate App Password
- Go to https://myaccount.google.com/apppasswords
- Select "Mail" and "Windows Computer" (or your device)
- Google will generate a 16-character password
- Copy this password (no spaces)

#### Step 3: Create .env File
Create a `.env` file in the project root (copy from `.env.example`):
```
GMAIL_USER=your-gmail@gmail.com
GMAIL_PASSWORD=your-16-char-app-password
PORT=3000
```

**Important:** Replace with your actual Gmail and app password.

### 3. Run the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### 4. Test the Application
- Navigate to `http://localhost:3000`
- Click "Start Now"
- Fill in the form with:
  - Brand/Business Name (min 2 characters)
  - Phone Number (6-20 characters, can include +, -, (), spaces)
  - Email Address (valid email format)
- Click Submit
- Data is saved to `leads.db` and email sent to promotewithus6@gmail.com

## File Changes Made

### 1. `package.json`
- Added `nodemailer` for email sending
- Added `dotenv` for environment variables

### 2. `server.js`
- Added email configuration using Gmail SMTP
- Added `sendEmailNotification()` function
- Enhanced `/api/lead` endpoint with:
  - Email validation
  - Phone validation
  - Email sending on successful form submission

### 3. `start.html`
- Enhanced form validation with real-time checks
- Added validation functions for email and phone
- Improved error messaging

### 4. `.env.example`
- Created template for environment variables

## Database

The SQLite database (`leads.db`) is automatically created with the following schema:
```sql
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Viewing Leads

Access the admin panel at `http://localhost:3000/admin`
- Username: `admin`
- Password: `password`

(Can be changed via `ADMIN_USER` and `ADMIN_PASS` environment variables)

## Troubleshooting

### Email not sending?
1. Verify Gmail credentials in `.env` file
2. Check that 2-Step Verification is enabled
3. Ensure app password was generated correctly (no spaces)
4. Check console logs for error messages

### "Git is not recognized"?
If you get this error when cloning, install Git from https://git-scm.com/download/win

## Support
For issues or questions, contact support or check the project documentation.
