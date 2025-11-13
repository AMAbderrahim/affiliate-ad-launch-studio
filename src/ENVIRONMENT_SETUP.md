# Environment Setup - Visual Guide

## 📍 Where to Add Your Credentials

```
Your Project Root
├── .env  ⬅️ CREATE THIS FILE AND ADD YOUR VALUES HERE
├── .env.example (template reference)
├── App.tsx
├── components/
├── context/
│   └── AuthContext.tsx (reads VITE_GOOGLE_CLIENT_ID)
├── services/
│   └── workerService.tsx (reads VITE_AGENT_WORKER)
└── env.d.ts (TypeScript types)
```

## 🎯 The `.env` File (Your Configuration Hub)

**Location:** Root of your project (same folder as `App.tsx`)

**Required Variables:**

```bash
# 1️⃣ CLOUDFLARE WORKER URL
VITE_AGENT_WORKER=https://YOUR-WORKER-NAME.YOUR-ACCOUNT.workers.dev

# 2️⃣ GOOGLE OAUTH CLIENT ID  
VITE_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR APPLICATION                         │
│                                                             │
│  ┌────────────────────┐         ┌────────────────────┐    │
│  │   AuthContext.tsx  │         │ workerService.tsx  │    │
│  │                    │         │                    │    │
│  │  Reads:            │         │  Reads:            │    │
│  │  VITE_GOOGLE_      │         │  VITE_AGENT_       │    │
│  │  CLIENT_ID         │         │  WORKER            │    │
│  └────────┬───────────┘         └─────────┬──────────┘    │
│           │                               │                │
│           │                               │                │
└───────────┼───────────────────────────────┼────────────────┘
            │                               │
            │   Reads from .env file        │
            │                               │
            ▼                               ▼
    ┌─────────────────────────────────────────────┐
    │           .env FILE (Root)                  │
    │                                             │
    │  VITE_GOOGLE_CLIENT_ID=your-id-here        │
    │  VITE_AGENT_WORKER=your-worker-url-here    │
    └─────────────────────────────────────────────┘
```

## 📋 Step-by-Step Setup

### Step 1: Get Your Cloudflare Worker URL

```bash
# After deploying your worker (see WORKER_SETUP.md)
# You'll get a URL like:

https://affiliate-agents.yourusername.workers.dev
```

**Copy this URL** - you'll paste it into `.env` in Step 3

---

### Step 2: Get Your Google Client ID

**Go to:** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

1. **Create a new project** or select existing
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Application type: **"Web application"**
4. **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   https://yourdomain.com
   ```
5. Click **"Create"**
6. **Copy the Client ID** (format: `xxxxx.apps.googleusercontent.com`)

---

### Step 3: Create Your `.env` File

**Create a new file** in your project root called `.env` and add:

```bash
# Replace with YOUR actual values:
VITE_AGENT_WORKER=https://affiliate-agents.yourusername.workers.dev
VITE_GOOGLE_CLIENT_ID=123456789012-abc123xyz456.apps.googleusercontent.com
```

**⚠️ Important:**
- File must be named exactly `.env` (with the dot at the start)
- Must be in the **root folder** (same level as `App.tsx`)
- Replace the example values with your actual credentials

---

### Step 4: Restart Development Server

```bash
# Stop your current server (Ctrl+C or Cmd+C)

# Start it again
npm run dev
# or
yarn dev
```

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] `.env` file exists in project root
- [ ] `VITE_AGENT_WORKER` is set to your Cloudflare Worker URL
- [ ] `VITE_GOOGLE_CLIENT_ID` is set to your Google OAuth Client ID
- [ ] Development server has been restarted
- [ ] Google Sign-In button appears on login page
- [ ] No "Worker endpoint not configured" errors
- [ ] `.env` file is listed in `.gitignore` (for security)

## 🔍 Troubleshooting

### Problem: "Worker endpoint not configured"

**Solution:**
```bash
# Check your .env file
cat .env

# Should show:
VITE_AGENT_WORKER=https://...

# If missing, add it and restart server
```

### Problem: Google Sign-In doesn't work

**Solution:**
```bash
# Check your .env file
cat .env

# Should show:
VITE_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com

# Also verify in Google Cloud Console:
# - OAuth client is created
# - localhost:5173 is in authorized origins
```

### Problem: Changes to `.env` not working

**Solution:**
```bash
# You MUST restart the dev server after changing .env
# Stop server: Ctrl+C
# Start again: npm run dev
```

## 📁 File Reference

| File | Purpose | Git Status |
|------|---------|------------|
| `.env` | Your actual credentials | ❌ NOT committed (in .gitignore) |
| `.env.example` | Template/reference | ✅ Safe to commit |
| `.gitignore` | Prevents .env from being committed | ✅ Committed |
| `env.d.ts` | TypeScript definitions | ✅ Committed |

## 🚀 Production Deployment

For production (Vercel, Netlify, etc.):

**Don't use the `.env` file** - instead, add environment variables in your hosting platform's dashboard:

### Vercel
1. Project Settings → Environment Variables
2. Add `VITE_AGENT_WORKER` and `VITE_GOOGLE_CLIENT_ID`

### Netlify
1. Site settings → Build & deploy → Environment
2. Add `VITE_AGENT_WORKER` and `VITE_GOOGLE_CLIENT_ID`

## 🔐 Security Notes

✅ **Safe to expose (Client-side):**
- `VITE_GOOGLE_CLIENT_ID` - Public by design

❌ **NEVER expose:**
- Google Gemini API Key (keep in Cloudflare Worker only!)
- Any database credentials
- Any secret tokens

The `.env` file in this project only contains **client-safe** variables. Your sensitive **Google Gemini API key** should only exist in your Cloudflare Worker's secrets (never in this `.env`).

## 🎓 Advanced: How Environment Variables Work

```javascript
// In your code, Vite exposes these as:
import.meta.env.VITE_AGENT_WORKER
import.meta.env.VITE_GOOGLE_CLIENT_ID

// The code automatically reads from .env:
// context/AuthContext.tsx (line 17-18)
const GOOGLE_CLIENT_ID = getEnvVar('VITE_GOOGLE_CLIENT_ID') || '';

// services/workerService.tsx (line 68-70)
const WORKER_ENDPOINT = getEnvVar('VITE_AGENT_WORKER') || '';
```

## 📚 Related Documentation

- **`WORKER_SETUP.md`** - How to deploy your Cloudflare Worker
- **`CONFIGURATION_GUIDE.md`** - Detailed configuration instructions
- **`QUICK_START_CHECKLIST.md`** - Complete setup checklist
- **`GEMINI_MIGRATION.md`** - Why we use Google Gemini

## 💡 Quick Commands

```bash
# View your current .env file
cat .env

# Edit your .env file (use any editor)
nano .env
# or
code .env

# Verify environment variables are loaded (in browser console)
console.log(import.meta.env.VITE_AGENT_WORKER)
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID)
```

---

**Need Help?** See `TROUBLESHOOTING.md` for common issues and solutions.
