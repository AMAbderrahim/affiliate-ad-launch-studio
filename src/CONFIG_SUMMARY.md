# Configuration Summary - At a Glance

## 📍 File: `.env` (Project Root)

This is the **ONLY** file you need to edit for configuration.

```bash
VITE_AGENT_WORKER=https://your-worker.workers.dev
VITE_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
```

---

## 🔄 How Configuration Flows

```
┌─────────────────────────────────────────────┐
│          .env FILE (ROOT)                   │
│  VITE_AGENT_WORKER=https://...             │
│  VITE_GOOGLE_CLIENT_ID=xxxxx...            │
└─────────────┬───────────────────────────────┘
              │
              │ Read at build/runtime
              │
    ┌─────────┴──────────┐
    │                    │
    ▼                    ▼
┌─────────────┐    ┌──────────────────┐
│ Auth        │    │ Worker           │
│ Context     │    │ Service          │
│             │    │                  │
│ Uses:       │    │ Uses:            │
│ GOOGLE_     │    │ AGENT_           │
│ CLIENT_ID   │    │ WORKER           │
└─────────────┘    └──────────────────┘
    │                    │
    └─────────┬──────────┘
              │
              ▼
      ┌───────────────┐
      │ APPLICATION   │
      │ WORKS! ✅     │
      └───────────────┘
```

---

## 📋 Configuration Checklist

### ✅ Files Created (Auto)
- [x] `.env` - Your configuration file (edit this!)
- [x] `.env.example` - Template reference
- [x] `.gitignore` - Protects your `.env` from being committed
- [x] `env.d.ts` - TypeScript type definitions

### ⚙️ Your Tasks
- [ ] Get Cloudflare Worker URL (deploy worker first)
- [ ] Add Worker URL to `.env`
- [ ] Get Google OAuth Client ID
- [ ] Add Client ID to `.env`
- [ ] Restart dev server

---

## 🎯 The Two Values You Need

| Variable | What It Is | Where to Get It | Format |
|----------|-----------|-----------------|--------|
| `VITE_AGENT_WORKER` | Your Cloudflare Worker endpoint | Deploy worker, copy URL | `https://name.account.workers.dev` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Google Cloud Console → Credentials | `12345-abc...xyz.apps.googleusercontent.com` |

---

## 🚀 Quick Setup Commands

```bash
# 1. Navigate to your project
cd affiliate-ad-studio

# 2. Open .env file
nano .env
# or
code .env

# 3. Edit the two values:
#    VITE_AGENT_WORKER=https://your-worker-url
#    VITE_GOOGLE_CLIENT_ID=your-client-id

# 4. Save and exit

# 5. Restart dev server
npm run dev
```

---

## 🔍 Verify Configuration

### In Browser Console
```javascript
// Should show your worker URL
import.meta.env.VITE_AGENT_WORKER

// Should show your client ID
import.meta.env.VITE_GOOGLE_CLIENT_ID
```

### Expected Behavior
✅ Google Sign-In button appears  
✅ No "Worker endpoint not configured" errors  
✅ Agents can send requests  

### Error Indicators
❌ "Worker endpoint not configured" → Check `VITE_AGENT_WORKER`  
❌ Google button doesn't render → Check `VITE_GOOGLE_CLIENT_ID`  
❌ Values are `undefined` → Restart dev server  

---

## 🔐 Security Notes

### ✅ Safe in `.env`
- `VITE_GOOGLE_CLIENT_ID` - Public by design, safe in client code

### ❌ NEVER in `.env`
- Google Gemini API Key - Keep in Cloudflare Worker secrets ONLY
- Database credentials
- Any secret tokens

### 🛡️ Protection
- `.env` is in `.gitignore` (won't be committed)
- Client-side variables are prefixed with `VITE_` (Vite only exposes these)
- Sensitive API key stays in Cloudflare Worker

---

## 📊 Production Deployment

### Development (.env file)
```bash
VITE_AGENT_WORKER=https://dev-worker.workers.dev
VITE_GOOGLE_CLIENT_ID=dev-client-id.apps.googleusercontent.com
```

### Production (Hosting Platform)
**Don't use `.env` in production!**

Instead, add environment variables in your hosting dashboard:

#### Vercel
1. Project Settings → Environment Variables
2. Add `VITE_AGENT_WORKER` and `VITE_GOOGLE_CLIENT_ID`

#### Netlify
1. Site Settings → Build & Deploy → Environment
2. Add `VITE_AGENT_WORKER` and `VITE_GOOGLE_CLIENT_ID`

#### Other Platforms
Check their documentation for "Environment Variables" section

---

## 🔗 Related Files

| File | Purpose | You Edit? |
|------|---------|-----------|
| `.env` | **Your configuration** | ✅ YES |
| `.env.example` | Template/reference | ❌ No |
| `.gitignore` | Protects .env | ❌ No |
| `env.d.ts` | TypeScript types | ❌ No |
| `context/AuthContext.tsx` | Reads Google Client ID | ❌ No |
| `services/workerService.tsx` | Reads Worker URL | ❌ No |

---

## 📚 Full Documentation

Choose your preferred guide:

### Quick & Visual
- **[WHERE_TO_ADD_CREDENTIALS.md](WHERE_TO_ADD_CREDENTIALS.md)** - One-page answer
- **[ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)** - Visual diagrams & step-by-step

### Detailed
- **[CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)** - Complete configuration reference

### Comprehensive
- **[QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md)** - Full deployment checklist
- **[WORKER_SETUP.md](WORKER_SETUP.md)** - Worker deployment guide
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Problem solving

---

## 💡 Common Questions

**Q: Where exactly is the `.env` file?**  
A: Same folder as `App.tsx`, `package.json`, and `README.md`

**Q: Do I need quotes around the values?**  
A: No! Just `VITE_AGENT_WORKER=https://...` (no quotes)

**Q: What if I don't have a worker yet?**  
A: Deploy it first using [WORKER_SETUP.md](WORKER_SETUP.md), then add the URL

**Q: Can I rename `.env` to `.env.local`?**  
A: Yes, but use `.env` for consistency with the docs

**Q: Changes not taking effect?**  
A: You MUST restart the dev server after editing `.env`

**Q: Is my API key in this file?**  
A: NO! Your Gemini API key should ONLY be in Cloudflare Worker secrets

---

## ✅ You're Done When...

- [x] `.env` file has your Worker URL
- [x] `.env` file has your Google Client ID
- [x] Dev server restarted
- [x] Google Sign-In button appears
- [x] No configuration errors in console
- [x] Ready to use the application! 🎉

---

**Need help?** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)  
**Ready to deploy?** See [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md)
