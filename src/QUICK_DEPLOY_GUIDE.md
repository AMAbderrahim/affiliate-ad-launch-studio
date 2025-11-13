# ⚡ Quick Deploy Guide

Deploy your Affiliate Ad Launch Studio to Vercel in under 15 minutes.

## 🎯 What You'll Do

1. Push code to GitHub (5 min)
2. Deploy to Vercel (5 min)  
3. Configure OAuth (3 min)
4. Test app (2 min)

**Total: ~15 minutes**

---

## 📋 Prerequisites

Before starting, have these ready:

### 1. Cloudflare Worker URL
```
Example: https://ai-agent-worker.yourname.workers.dev
```
- See: `WORKER_SETUP.md` for deployment
- Your worker should be deployed and tested

### 2. Google OAuth Client ID
```
Example: 123456789-abcdefgh.apps.googleusercontent.com
```
- Get from: [Google Cloud Console](https://console.cloud.google.com/)
- See: `WHERE_TO_ADD_CREDENTIALS.md` for setup

### 3. Accounts
- ✅ GitHub account
- ✅ Vercel account (sign up with GitHub)
- ✅ Git installed on your computer

---

## 🚀 Step 1: Push to GitHub (5 min)

### 1.1 Create GitHub Repository

Go to: **https://github.com/new**

Fill in:
- **Repository name**: `affiliate-ad-launch-studio`
- **Description**: `Professional advertising campaign management platform`
- **Visibility**: Public or Private (your choice)
- **DO NOT** initialize with README, .gitignore, or license

Click **"Create repository"**

### 1.2 Push Your Code

Open terminal in your project folder and run:

```bash
# Initialize Git
git init

# Stage all files
git add .

# Create first commit
git commit -m "Initial commit: Affiliate Ad Launch Studio v1.0.0"

# Rename branch to main
git branch -M main

# Add GitHub as remote (REPLACE with your username!)
git remote add origin https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio.git

# Push to GitHub
git push -u origin main
```

### 1.3 Verify Upload

- Refresh your GitHub repository page
- You should see all files
- README.md should display

✅ **Step 1 Complete!**

---

## 🚀 Step 2: Deploy to Vercel (5 min)

### 2.1 Import Project

1. Go to: **https://vercel.com/dashboard**
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Find `affiliate-ad-launch-studio`
5. Click **"Import"**

### 2.2 Configure Project

Vercel auto-detects everything, verify:

- **Framework Preset**: Vite ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅
- **Install Command**: `npm install` ✅

**Don't change these! They're correct.**

### 2.3 Add Environment Variables

Click **"Environment Variables"**

Add these **TWO** variables:

#### Variable 1: VITE_AGENT_WORKER
```
Name:  VITE_AGENT_WORKER
Value: https://your-worker.yourname.workers.dev
```
☑️ Check all three: Production, Preview, Development

#### Variable 2: VITE_GOOGLE_CLIENT_ID
```
Name:  VITE_GOOGLE_CLIENT_ID
Value: 123456789-abcdefgh.apps.googleusercontent.com
```
☑️ Check all three: Production, Preview, Development

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait ~2 minutes for build
3. Click on deployment when complete
4. Copy your URL: `https://your-app.vercel.app`

✅ **Step 2 Complete!**

---

## 🔐 Step 3: Configure OAuth (3 min)

Your app is live, but login won't work yet. Fix it:

### 3.1 Add Vercel URL to Google OAuth

1. Go to: **https://console.cloud.google.com/**
2. Select your project
3. Navigate: **APIs & Services** → **Credentials**
4. Click your **OAuth 2.0 Client ID**
5. Under **"Authorized JavaScript origins"**, click **"+ ADD URI"**
6. Add your Vercel URL:
   ```
   https://your-app.vercel.app
   ```
7. Click **"Save"**

### 3.2 Test (takes 1-2 minutes to propagate)

1. Visit your Vercel URL
2. Click "Sign in with Google"
3. Should work! 🎉

✅ **Step 3 Complete!**

---

## ✅ Step 4: Test App (2 min)

Visit your deployed app and test:

### 4.1 Basic Functionality
- [ ] App loads without errors
- [ ] Login page displays
- [ ] Google sign-in works
- [ ] Redirects to app after login

### 4.2 Navigation
- [ ] Sidebar shows all pages
- [ ] Can click between pages
- [ ] URL updates correctly

### 4.3 Test an Agent
- [ ] Go to "Marketing Strategist"
- [ ] Type a test message: "Hello"
- [ ] Click Send
- [ ] Receive AI response

### 4.4 Check for Issues
- [ ] Open browser console (F12)
- [ ] No red errors
- [ ] Check Network tab
- [ ] No failed requests

✅ **Step 4 Complete!**

---

## 🎉 Success!

Your app is now live at: **https://your-app.vercel.app**

### What Just Happened?

✅ Code pushed to GitHub
✅ Vercel built your app (Vite → `dist/`)
✅ App deployed to Vercel CDN
✅ Environment variables configured
✅ Google OAuth working
✅ AI agents connected to your Worker
✅ SPA routing configured

### Automatic Deployments

Every time you push to GitHub:
- Vercel automatically builds
- Runs type checking
- Deploys if successful
- Updates your live app

---

## 🔄 Making Updates

### To update your app:

```bash
# 1. Make changes to your code
# 2. Commit changes
git add .
git commit -m "Description of changes"

# 3. Push to GitHub
git push origin main

# 4. Vercel automatically deploys!
# Watch progress at: vercel.com/dashboard
```

### To rollback:

1. Go to Vercel dashboard
2. Click your project
3. Go to "Deployments"
4. Find working deployment
5. Click "..." → "Promote to Production"

---

## 🎨 Optional: Add Custom Domain

### Add your domain (e.g., adstudio.com):

1. **In Vercel**:
   - Go to project → Settings → Domains
   - Click "Add"
   - Enter: `adstudio.com` or `app.adstudio.com`
   - Follow DNS instructions

2. **Update Google OAuth**:
   - Add custom domain to authorized origins
   - Same process as Step 3

3. **Update Worker CORS** (if needed):
   - Add custom domain to allowed origins
   - Redeploy worker

---

## 📊 Monitoring

### Vercel Dashboard

Track your app at: **https://vercel.com/dashboard**

View:
- 📈 Deployments history
- 🚀 Build logs
- 📊 Analytics (optional)
- ⚙️ Environment variables
- 🌐 Custom domains

### GitHub Repository

Manage code at: **https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio**

Features:
- 📝 Code management
- 🔀 Pull requests
- 🐛 Issues tracking
- 📚 Documentation
- 👥 Collaborators

---

## 🐛 Troubleshooting

### Build Failed
**Issue**: Deployment failed in Vercel

**Fix**:
1. Check build logs in Vercel
2. Test locally: `npm run build`
3. Fix errors
4. Push again

### Login Doesn't Work
**Issue**: Google sign-in fails

**Fix**:
1. Verify `VITE_GOOGLE_CLIENT_ID` in Vercel
2. Check Vercel URL in Google OAuth authorized origins
3. Wait 2-3 minutes for changes to propagate
4. Try incognito/private browsing

### Agent Not Responding
**Issue**: No response from agents

**Fix**:
1. Check `VITE_AGENT_WORKER` in Vercel
2. Test worker URL directly in browser
3. Check Cloudflare Worker logs
4. Verify CORS allows Vercel domain

### 404 on Page Refresh
**Issue**: Refreshing page shows 404

**Fix**: Should be fixed! Check `vercel.json` has:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📚 Next Steps

### Immediate
- [ ] Share app URL with team/users
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics (optional)
- [ ] Star your GitHub repo

### Soon
- [ ] Add team members to GitHub
- [ ] Set up branch protection
- [ ] Configure deployment notifications
- [ ] Plan first feature update

### Later
- [ ] Performance optimization
- [ ] Add more agents
- [ ] User feedback collection
- [ ] Analytics integration

---

## 📖 Documentation

For detailed guides:

| Topic | Document |
|-------|----------|
| Full deployment | `VERCEL_DEPLOYMENT.md` |
| GitHub setup | `GITHUB_SETUP.md` |
| Checklist | `DEPLOYMENT_CHECKLIST.md` |
| Build details | `BUILD_DEPLOYMENT.md` |
| Troubleshooting | `TROUBLESHOOTING.md` |
| Complete overview | `DEPLOYMENT_READY.md` |

---

## ✅ Deployment Checklist

Quick checklist to ensure everything is done:

- [ ] Code pushed to GitHub
- [ ] Repository visible on GitHub
- [ ] Vercel connected to GitHub repo
- [ ] Environment variables set in Vercel
- [ ] App deployed successfully
- [ ] Deployment URL works
- [ ] Google OAuth configured
- [ ] Login works
- [ ] At least one agent tested
- [ ] No console errors
- [ ] Mobile responsive (test on phone)

---

## 🎊 Congratulations!

You've successfully deployed your Affiliate Ad Launch Studio!

**Your App**: https://your-app.vercel.app
**Your Repo**: https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio

### Share Your Success
- Tweet about it
- Add to portfolio
- Share with team
- Get feedback

### Keep Building
- Monitor usage
- Gather feedback  
- Plan improvements
- Ship updates

---

**Need help?** Check `TROUBLESHOOTING.md` or open an issue on GitHub.

**Happy launching! 🚀**
