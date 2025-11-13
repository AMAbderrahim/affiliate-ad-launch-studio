# ⚡ Quick Reference Card

One-page reference for deploying and managing your Affiliate Ad Launch Studio.

---

## 🚀 Deploy in 3 Commands

```bash
# 1. Push to GitHub (change YOUR_USERNAME)
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio.git
git push -u origin main

# 2. Go to Vercel → vercel.com/new → Import repo → Add env vars → Deploy

# 3. Google Console → Add Vercel URL to OAuth origins → Done!
```

---

## 📋 Required Environment Variables

| Variable | Value | Where |
|----------|-------|-------|
| `VITE_AGENT_WORKER` | `https://worker.workers.dev` | Vercel Dashboard |
| `VITE_GOOGLE_CLIENT_ID` | `123-abc.apps.google.com` | Vercel Dashboard |

---

## 📚 Essential Documentation

| Need | File | Time |
|------|------|------|
| **Deploy now** | [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md) | 15 min |
| **Full checklist** | [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | 30 min |
| **Overview** | [START_DEPLOYMENT.md](START_DEPLOYMENT.md) | 5 min |
| **GitHub setup** | [GITHUB_SETUP.md](GITHUB_SETUP.md) | 10 min |
| **Vercel guide** | [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) | 20 min |
| **Troubleshoot** | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) | As needed |

---

## 🛠️ Common Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server (localhost:3000)
npm run type-check      # Check TypeScript
npm run build           # Build for production
npm run preview         # Preview production build

# Git
git status              # Check status
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to GitHub (auto-deploys!)

# Vercel CLI (optional)
npm install -g vercel   # Install CLI
vercel login            # Login
vercel                  # Deploy to preview
vercel --prod           # Deploy to production
```

---

## 🏗️ Project Structure

```
affiliate-ad-launch-studio/
├── components/agents/        # 11 AI agents
├── components/ui/           # 42 Shadcn components
├── components/              # 8 core components
├── context/                 # Auth & Campaign state
├── services/                # API services
├── public/                  # Static assets
├── App.tsx                  # Root component
├── main.tsx                 # Entry point
├── vite.config.ts          # Build → dist/
└── vercel.json             # Deployment config
```

---

## 🎯 File Locations

| What | Where |
|------|-------|
| **Build config** | `vite.config.ts` |
| **Deploy config** | `vercel.json` |
| **Dependencies** | `package.json` |
| **TypeScript** | `tsconfig.json` |
| **Entry HTML** | `index.html` |
| **Entry JS** | `main.tsx` |
| **Routes** | `App.tsx` |
| **Env template** | `.env.example` |
| **Your env** | `.env` (create this) |

---

## 🔧 Build Configuration

### Output Directory
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # Your app
│   ├── index-[hash].css   # Styles
│   ├── react-vendor.js    # React libs
│   └── ui-vendor.js       # UI libs
└── [public files]
```

### Build Process
```
npm run build
  → TypeScript compile
  → Vite build
  → Code splitting
  → Minification
  → Output to dist/
```

---

## 🌐 URLs After Deployment

| Service | URL |
|---------|-----|
| **Your app** | `https://your-app.vercel.app` |
| **GitHub** | `https://github.com/USER/affiliate-ad-launch-studio` |
| **Vercel dashboard** | `https://vercel.com/dashboard` |
| **Worker** | `https://worker.workers.dev` |
| **Google Console** | `https://console.cloud.google.com` |

---

## ✅ Deployment Checklist

- [ ] Worker deployed to Cloudflare
- [ ] Google OAuth Client ID created
- [ ] `.env` created locally (not committed!)
- [ ] Code pushed to GitHub
- [ ] Repository imported in Vercel
- [ ] Environment variables added in Vercel
- [ ] App deployed successfully
- [ ] Vercel URL added to Google OAuth
- [ ] Login tested
- [ ] Agent tested

---

## 🐛 Quick Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| **Build fails** | `rm -rf node_modules dist && npm install && npm run build` |
| **Login fails** | Add Vercel URL to Google OAuth origins, wait 3 min |
| **Agent no response** | Check `VITE_AGENT_WORKER` in Vercel, test worker URL |
| **404 on refresh** | Check `vercel.json` has SPA rewrites |
| **Env vars not working** | Must start with `VITE_`, rebuild after changing |

---

## 📊 Key Metrics

| Metric | Value |
|--------|-------|
| **Total files** | 111 |
| **Components** | 62 |
| **AI Agents** | 11 |
| **Build time** | ~2 minutes |
| **Deploy time** | ~15 minutes (total) |
| **First load** | < 2 seconds |
| **Cost** | $0 (free tier) |

---

## 🔄 Update Workflow

```bash
# 1. Make code changes locally
# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "Description of changes"
git push

# 4. Vercel automatically deploys!
# 5. Check vercel.com/dashboard for status
```

---

## 🎓 Learning Resources

| Topic | Link |
|-------|------|
| **React docs** | https://react.dev |
| **Vite docs** | https://vitejs.dev |
| **Tailwind docs** | https://tailwindcss.com |
| **Vercel docs** | https://vercel.com/docs |
| **Cloudflare Workers** | https://workers.cloudflare.com |
| **Google Gemini** | https://ai.google.dev |

---

## 📞 Help & Support

| Need Help With | Check |
|----------------|-------|
| **Getting started** | [START_DEPLOYMENT.md](START_DEPLOYMENT.md) |
| **Quick deploy** | [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md) |
| **Detailed deploy** | [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) |
| **Errors** | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| **All docs** | [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) |

---

## 🎯 Quick Actions

### First Time Setup
1. Read [START_DEPLOYMENT.md](START_DEPLOYMENT.md)
2. Follow [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md)
3. Deploy in 15 minutes

### Making Changes
1. Edit code
2. Test with `npm run dev`
3. Push to GitHub
4. Auto-deploys to Vercel

### Troubleshooting
1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Verify environment variables
3. Test worker directly
4. Check Vercel build logs

---

## 💡 Pro Tips

✅ **Use `npm run preview`** to test production build locally

✅ **Check Vercel logs** if deployment fails

✅ **Test in incognito** if OAuth acts weird

✅ **Environment variables** require rebuild to take effect

✅ **Branch protection** prevents accidental force pushes

✅ **Preview deployments** auto-created for PRs

---

## 🚀 Ready to Deploy?

**Fastest path:**
1. Open [QUICK_DEPLOY_GUIDE.md](QUICK_DEPLOY_GUIDE.md)
2. Follow 4 steps
3. Done in 15 minutes!

**Need details:**
1. Open [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
2. Follow complete checklist
3. Done in 30 minutes!

---

## 📝 Notes

- All environment variables must start with `VITE_`
- `.env` is gitignored (never commit secrets!)
- Vercel auto-deploys on push to main
- Worker must have CORS configured
- Google OAuth needs 2-3 min to propagate changes

---

**Print this page for quick reference!** 🖨️

**Bookmark for easy access:** This file contains everything you need to know at a glance.

---

**Ready?** → [START_DEPLOYMENT.md](START_DEPLOYMENT.md) 🚀
