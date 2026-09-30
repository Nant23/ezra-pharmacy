# Ezra Pharmacy - Hosting & Deployment Guide

This guide explains how to host Ezra Pharmacy on **eHosting** (cPanel / Apache / Shared Web Hosting / VPS).

---

## 🚀 Option 1: Quick Deployment (Recommended - Under 2 Minutes)

Use the pre-built production package: `ezra-pharmacy-production.zip` (only ~830 KB).

### Steps:
1. Log in to your **eHosting / cPanel** account.
2. Open **File Manager**.
3. Navigate to your website's root directory (usually `public_html` or `www` or your subdomain folder).
4. **Upload** `ezra-pharmacy-production.zip`.
5. Right-click the uploaded zip file and click **Extract**.
6. Ensure the extracted files (`index.html`, `assets/`, `.htaccess`, `favicon.svg`, etc.) are directly inside `public_html` (not inside a subfolder).
7. Delete `ezra-pharmacy-production.zip` from the server.
8. Visit your website domain (e.g., `https://yourdomain.com`). Your application is live!

> [!NOTE]
> The package already includes a pre-configured `.htaccess` file so that React Router URLs (`/about`, `/medicines`, `/prescription`, `/admin`, etc.) work seamlessly without 404 errors on page refresh.

---

## 🛠️ Option 2: Deploy from Source Code

If you or your hosting provider prefer building the project directly on a Node.js server, VPS, or Vercel/Netlify:

Use `ezra-pharmacy-source.zip` (~1.4 MB).

### Prerequisites:
- Node.js (version 18 or higher)
- npm (version 9 or higher)

### Build Commands:
```bash
# 1. Install dependencies
npm install

# 2. Build production bundle
npm run build

# 3. Preview locally (optional)
npm run preview
```
The output will be generated in the `dist/` directory, ready to be served by any static web server (Nginx, Apache, Caddy, etc.).

---

## ⚙️ Environment Variables (Optional - Supabase Cloud)

The application functions completely out-of-the-box with persistent local storage and mock data. To connect to your Supabase project:

1. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
2. Re-run `npm run build`.

### Contact Messages

Customer Contact form submissions are stored in the Supabase `contact_messages` table and can be reviewed in **Admin → Messages**. Run `supabase/contact-messages.sql` in the Supabase SQL Editor to create the table and its row-level security policies.

---

## 🔑 Default Admin Account
- **Portal URL**: `/admin` or `/admin/prescriptions`
- **Email**: `admin@ezrapharmacy.com`
- **Password**: Any password with 6+ characters (e.g. `admin123`)
