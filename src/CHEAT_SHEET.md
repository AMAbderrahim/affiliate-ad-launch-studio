# 🚀 Configuration Cheat Sheet

## The Only File You Need to Edit

```
📁 your-project/
   └── .env  ⬅️ EDIT THIS FILE
```

## The Two Values You Need

```bash
VITE_AGENT_WORKER=https://your-worker.workers.dev
VITE_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
```

## Where to Get Them

### 1. Worker URL
**Get from:** Cloudflare Worker deployment  
**Guide:** [WORKER_SETUP.md](WORKER_SETUP.md)  
**Format:** `https://name.account.workers.dev`

### 2. Google Client ID
**Get from:** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)  
**Create:** OAuth 2.0 Client ID → Web Application  
**Format:** `123456789012-abc...xyz.apps.googleusercontent.com`

## After Editing

```bash
# Restart your dev server
npm run dev
```

## Verify It Works

```javascript
// In browser console:
console.log(import.meta.env.VITE_AGENT_WORKER);
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
```

## Common Mistakes

❌ Don't add quotes: `VITE_AGENT_WORKER="https://..."`  
❌ Don't add spaces: `VITE_AGENT_WORKER = https://...`  
✅ Do this: `VITE_AGENT_WORKER=https://...`

## Quick Links

- **30-second guide:** [WHERE_TO_ADD_CREDENTIALS.md](WHERE_TO_ADD_CREDENTIALS.md)
- **Visual guide:** [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)
- **Full reference:** [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)
- **All docs:** [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

## File Locations Reference

| What | File | Location |
|------|------|----------|
| **Your config** | `.env` | Project root |
| **Auth setup** | `context/AuthContext.tsx` | Uses `VITE_GOOGLE_CLIENT_ID` |
| **Worker calls** | `services/workerService.tsx` | Uses `VITE_AGENT_WORKER` |
| **Type defs** | `env.d.ts` | Project root |

---

**That's it! Two values, one file.** 🎉
