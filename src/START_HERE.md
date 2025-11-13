# 👋 START HERE - Affiliate Ad Launch Studio Setup

## 🎯 Quick Answer to Your Question

**Q: Where can I add my Worker URL and Google Client ID?**

**A: In the `.env` file in your project root!**

---

## 📍 Exact Location

```
your-project/
├── .env  ⬅️ OPEN AND EDIT THIS FILE
├── README.md
├── App.tsx
└── ...
```

---

## ✏️ What to Add

Open `.env` and replace these two values:

```bash
# Line 1: Your Cloudflare Worker URL
VITE_AGENT_WORKER=https://your-worker-name.your-account.workers.dev

# Line 2: Your Google OAuth Client ID  
VITE_GOOGLE_CLIENT_ID=123456789012-abc...xyz.apps.googleusercontent.com
```

---

## 🔑 Getting Your Values

### Worker URL
1. Deploy Cloudflare Worker first
2. Copy the URL (format: `https://name.account.workers.dev`)
3. Paste into `.env`

👉 **How to deploy:** [WORKER_SETUP.md](WORKER_SETUP.md)

### Google Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID
3. Select "Web application"
4. Copy the Client ID
5. Paste into `.env`

👉 **Step-by-step:** [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)

---

## ✅ After Adding

```bash
# Restart your development server
npm run dev
```

---

## 📚 Need More Help?

Choose your guide based on detail level:

### ⚡ Ultra Quick (30 seconds)
→ **[CHEAT_SHEET.md](CHEAT_SHEET.md)** - One-page reference

### 🎯 Quick Start (2 minutes)  
→ **[WHERE_TO_ADD_CREDENTIALS.md](WHERE_TO_ADD_CREDENTIALS.md)** - Quick answer with examples

### 📊 At a Glance (5 minutes)
→ **[CONFIG_SUMMARY.md](CONFIG_SUMMARY.md)** - Configuration overview with diagrams

### 🎨 Visual Guide (10 minutes)
→ **[ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)** - Step-by-step with visual aids

### 📖 Complete Reference (20 minutes)
→ **[CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)** - Full configuration documentation

### 🗺️ All Documentation
→ **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete index of all guides

---

## 🚀 Full Setup Flow

```
1. Edit .env file
   ↓
2. Deploy Cloudflare Worker
   ↓  
3. Add Worker URL to .env
   ↓
4. Create Google OAuth Client
   ↓
5. Add Client ID to .env
   ↓
6. Restart dev server
   ↓
7. Done! ✅
```

**Detailed checklist:** [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md)

---

## 🎓 Documentation Quick Links

| I want to... | Read this |
|-------------|-----------|
| Add my credentials NOW | [CHEAT_SHEET.md](CHEAT_SHEET.md) |
| See visual setup guide | [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) |
| Deploy my worker | [WORKER_SETUP.md](WORKER_SETUP.md) |
| Deploy to production | [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) |
| Fix an error | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| Understand costs | [GEMINI_MIGRATION.md](GEMINI_MIGRATION.md) |
| See all documentation | [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) |

---

## 🔍 Verify Everything Works

After setup, check:

✅ Google Sign-In button appears  
✅ No "Worker endpoint not configured" errors  
✅ Agents can generate responses  
✅ Browser console shows no errors  

---

## 🆘 Common Issues

**"Worker endpoint not configured"**  
→ Check `VITE_AGENT_WORKER` in `.env` and restart server

**Google Sign-In doesn't work**  
→ Check `VITE_GOOGLE_CLIENT_ID` in `.env` and verify OAuth setup

**Changes not taking effect**  
→ You MUST restart dev server after editing `.env`

**More help:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📋 Files Created for You

Your project now includes:

### Configuration Files ✅
- `.env` - Your configuration (edit this!)
- `.env.example` - Template reference
- `.gitignore` - Protects your credentials

### Quick Start Guides ⚡
- `START_HERE.md` - This file!
- `CHEAT_SHEET.md` - One-page reference
- `WHERE_TO_ADD_CREDENTIALS.md` - Quick answer

### Setup Guides 📖
- `ENVIRONMENT_SETUP.md` - Visual setup guide
- `CONFIGURATION_GUIDE.md` - Complete reference
- `WORKER_SETUP.md` - Worker deployment
- `QUICK_START_CHECKLIST.md` - Full checklist

### Reference Docs 📚
- `CONFIG_SUMMARY.md` - Configuration overview
- `DOCUMENTATION_INDEX.md` - All docs organized
- `GEMINI_MIGRATION.md` - Migration info
- `TROUBLESHOOTING.md` - Problem solving

---

## 🎯 Your Next Steps

1. ✅ **Right now:** Edit `.env` with your credentials
2. ✅ **If needed:** Deploy worker using [WORKER_SETUP.md](WORKER_SETUP.md)
3. ✅ **Then:** Restart dev server with `npm run dev`
4. ✅ **Finally:** Start using the app! 🎉

---

## 💡 Pro Tips

✨ Bookmark [CHEAT_SHEET.md](CHEAT_SHEET.md) for quick reference  
✨ Keep [TROUBLESHOOTING.md](TROUBLESHOOTING.md) handy  
✨ Use [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) to find anything  

---

**Ready?** → Edit `.env` and add your two values! 🚀
