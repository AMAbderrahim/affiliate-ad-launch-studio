# 🚀 Vercel Deployment Guide

Complete guide for deploying your Affiliate Ad Launch Studio to Vercel via GitHub.

## 📋 Prerequisites

- [x] GitHub account
- [x] Vercel account (sign up at [vercel.com](https://vercel.com))
- [x] Google OAuth Client ID (see `WHERE_TO_ADD_CREDENTIALS.md`)
- [x] Cloudflare Worker deployed with Gemini API (see `WORKER_SETUP.md`)

## 🎯 Deployment Steps

### Step 1: Push to GitHub

1. **Initialize Git repository** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Affiliate Ad Launch Studio"
```

2. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Name: `affiliate-ad-launch-studio` (or your preferred name)
   - Description: "Professional advertising campaign management platform"
   - Set to Public or Private
   - Don't initialize with README (you already have one)
   - Click "Create repository"

3. **Push your code**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**:
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"

2. **Import Git Repository**:
   - Click "Import Git Repository"
   - Select your GitHub account (authorize if needed)
   - Find and select `affiliate-ad-launch-studio`
   - Click "Import"

3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected from vercel.json)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables**:
   Click "Environment Variables" and add:
   
   | Name | Value | Environment |
   |------|-------|-------------|
   | `VITE_AGENT_WORKER` | `https://your-worker.your-subdomain.workers.dev` | Production, Preview, Development |
   | `VITE_GOOGLE_CLIENT_ID` | `your-client-id.apps.googleusercontent.com` | Production, Preview, Development |

   > **Important**: Check all three environment types (Production, Preview, Development)

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (~1-2 minutes)
   - Your app will be live at `https://your-project.vercel.app`

#### Option B: Using Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? `affiliate-ad-launch-studio`
- In which directory is your code located? `./`
- Want to override settings? **N**

4. **Add environment variables**:
```bash
vercel env add VITE_AGENT_WORKER production
# Paste your worker URL when prompted

vercel env add VITE_GOOGLE_CLIENT_ID production
# Paste your Google Client ID when prompted
```

5. **Deploy to production**:
```bash
vercel --prod
```

### Step 3: Configure Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Domains"
   - Click "Add"
   - Enter your domain (e.g., `adstudio.yourdomain.com`)
   - Follow DNS configuration instructions

2. **Update Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Update OAuth authorized JavaScript origins:
     - Add `https://yourdomain.com`
   - Update authorized redirect URIs if needed

### Step 4: Verify Deployment

1. **Visit your deployed app**:
   - Click on the deployment URL from Vercel
   - Should see the login page

2. **Test Google Authentication**:
   - Click "Sign in with Google"
   - Should redirect to Google login
   - After auth, should redirect back to app

3. **Test an Agent**:
   - Navigate to any agent (e.g., Marketing Strategist)
   - Send a test message
   - Verify response from Cloudflare Worker

## 🔄 Automatic Deployments

### Every Git Push Triggers Deployment

With Vercel connected to your GitHub repository:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull Requests** → Preview deployment with unique URL

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push origin main

# Vercel automatically builds and deploys
```

### Deployment Status

- Check deployment status at [vercel.com/dashboard](https://vercel.com/dashboard)
- Vercel comments on PRs with preview URLs
- Get deployment notifications via email/Slack

## 🎛️ Vercel Configuration

### vercel.json Settings

The project includes `vercel.json` with optimal settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Features**:
- ✅ SPA routing (all routes → index.html)
- ✅ Asset caching (1 year for static files)
- ✅ Automatic builds on push
- ✅ Preview deployments for PRs

## 🔐 Environment Variables Management

### Adding Variables

**Via Dashboard**:
1. Go to Project Settings → Environment Variables
2. Add variable name and value
3. Select environments (Production, Preview, Development)
4. Click "Save"

**Via CLI**:
```bash
# Production
vercel env add VARIABLE_NAME production

# Preview (for PR branches)
vercel env add VARIABLE_NAME preview

# Development (for local dev with vercel dev)
vercel env add VARIABLE_NAME development
```

### Updating Variables

**Via Dashboard**:
1. Go to Environment Variables
2. Click Edit on the variable
3. Update value
4. Click "Save"
5. **Redeploy** to apply changes

**Via CLI**:
```bash
vercel env rm VARIABLE_NAME production
vercel env add VARIABLE_NAME production
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_AGENT_WORKER` | Cloudflare Worker URL | `https://ai-worker.yourname.workers.dev` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `123456-abc.apps.googleusercontent.com` |

> **Note**: All environment variables must start with `VITE_` to be accessible in the app.

## 📊 Monitoring & Analytics

### Vercel Analytics (Optional)

1. **Enable Analytics**:
   - Go to Project Settings → Analytics
   - Click "Enable"
   - Free tier: 100k events/month

2. **View Analytics**:
   - Dashboard shows page views, visitors, performance
   - Available at `https://vercel.com/[username]/[project]/analytics`

### Vercel Speed Insights (Optional)

Add to your app for Core Web Vitals:

```bash
npm install @vercel/analytics
```

Update `main.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
```

## 🐛 Troubleshooting

### Build Fails

**Error**: `Cannot find module 'X'`
- **Fix**: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

**Error**: `Environment variable not defined`
- **Fix**: Add missing environment variables in Vercel dashboard
- Ensure variables start with `VITE_`

**Error**: `Build exceeded maximum duration`
- **Fix**: Optimize build process
- Check for infinite loops in build scripts

### Runtime Errors

**Error**: 404 on routes
- **Fix**: Check `vercel.json` has correct rewrite rules
- Verify `dist/` contains `index.html`

**Error**: `Worker not responding`
- **Fix**: Verify `VITE_AGENT_WORKER` URL is correct
- Test worker URL directly in browser
- Check Cloudflare Worker logs

**Error**: `Google authentication failed`
- **Fix**: Add Vercel domain to Google OAuth authorized origins
- Verify `VITE_GOOGLE_CLIENT_ID` is correct
- Check redirect URIs in Google Cloud Console

### Deployment Issues

**Deployment stuck**:
- Check build logs in Vercel dashboard
- Look for errors in npm install or build step
- Try redeploying: click "Redeploy" in deployments

**Preview deployment not updating**:
- Ensure branch is pushed to GitHub
- Check Vercel is connected to correct repository
- Verify GitHub app permissions

## 🔧 Advanced Configuration

### Custom Build Settings

Override in Vercel Dashboard → Settings → General:

- **Node.js Version**: 20.x (recommended)
- **Install Command**: `npm ci` (faster than npm install)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment-Specific Builds

Use different configs for preview vs production:

```bash
# In vercel.json
{
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  }
}
```

### Edge Functions (Future)

Vercel Edge Functions can replace Cloudflare Workers:

1. Create `/api` directory
2. Add Edge Functions
3. Update worker service to use `/api` endpoints

## 📈 Performance Optimization

### Already Configured

✅ **Code Splitting**: Automatic vendor chunks
✅ **Asset Caching**: 1-year cache headers
✅ **Compression**: Automatic gzip/brotli
✅ **CDN**: Global edge network
✅ **HTTP/2**: Enabled by default

### Additional Optimizations

**Enable Image Optimization**:
```tsx
import Image from 'next/image' // If migrating to Next.js
```

**Preload Critical Resources**:
Add to `index.html`:
```html
<link rel="preconnect" href="https://your-worker.workers.dev">
<link rel="dns-prefetch" href="https://accounts.google.com">
```

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Vercel GitHub Integration](https://vercel.com/docs/git/vercel-for-github)

## 🎉 Success Checklist

After deployment, verify:

- [ ] App loads at Vercel URL
- [ ] Google login works
- [ ] All 11 agents are accessible
- [ ] Agent chat sends/receives messages
- [ ] Main Data Hub displays data
- [ ] Weekly Reports load correctly
- [ ] Navigation works on all routes
- [ ] No 404 errors on page refresh
- [ ] Environment variables are set
- [ ] Custom domain configured (if applicable)

## 🚀 Next Steps

1. **Set up monitoring**: Enable Vercel Analytics
2. **Configure alerts**: Set up deployment notifications
3. **Add team members**: Invite collaborators in Vercel
4. **Document deployment**: Update team wiki with deployment info
5. **Plan updates**: Set up a deployment schedule

---

Need help? Check `TROUBLESHOOTING.md` or open an issue on GitHub.
