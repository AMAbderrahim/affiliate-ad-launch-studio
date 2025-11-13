# 🎯 Quick Answer: Where to Add Your Credentials

## Location: `.env` file in project root

```
your-project/
├── .env  ⬅️ EDIT THIS FILE
├── App.tsx
├── components/
└── ...
```

## What to Add

Open `.env` and replace these values with your actual credentials:

```bash
VITE_AGENT_WORKER=https://YOUR-ACTUAL-WORKER-URL.workers.dev
VITE_GOOGLE_CLIENT_ID=YOUR-ACTUAL-CLIENT-ID.apps.googleusercontent.com
```

## Getting Your Values

### 1️⃣ Cloudflare Worker URL

**Where:** After deploying your Cloudflare Worker  
**Format:** `https://worker-name.your-account.workers.dev`  
**How to get:** See [WORKER_SETUP.md](WORKER_SETUP.md)  

Example:
```bash
VITE_AGENT_WORKER=https://affiliate-agents.myname.workers.dev
```

### 2️⃣ Google OAuth Client ID

**Where:** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)  
**Format:** `123456789012-abc...xyz.apps.googleusercontent.com`  
**How to get:** Create OAuth 2.0 Client ID → Web Application  

Example:
```bash
VITE_GOOGLE_CLIENT_ID=123456789012-abc123xyz456.apps.googleusercontent.com
```

## After Adding

1. **Save** the `.env` file
2. **Restart** your development server:
   ```bash
   # Stop: Ctrl+C or Cmd+C
   # Start:
   npm run dev
   ```

## Verification

Open browser console and check:
```javascript
console.log(import.meta.env.VITE_AGENT_WORKER);
// Should show: https://your-worker.workers.dev

console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
// Should show: your-id.apps.googleusercontent.com
```

## ❌ Common Mistakes

Don't do this:
```bash
# ❌ WRONG - Has quotes
VITE_AGENT_WORKER="https://worker.workers.dev"

# ❌ WRONG - Has spaces
VITE_AGENT_WORKER = https://worker.workers.dev

# ❌ WRONG - Wrong prefix
REACT_APP_AGENT_WORKER=https://worker.workers.dev
```

Do this:
```bash
# ✅ CORRECT
VITE_AGENT_WORKER=https://worker.workers.dev
VITE_GOOGLE_CLIENT_ID=123456789012-abc.apps.googleusercontent.com
```

## 🆘 Need More Help?

- **Detailed setup:** [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)
- **Step-by-step:** [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)
- **Full checklist:** [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**That's it!** Two values in one file. You're ready to go! 🚀
