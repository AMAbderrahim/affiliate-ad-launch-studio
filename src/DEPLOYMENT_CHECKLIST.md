# ✅ Deployment Checklist

Complete checklist for deploying Affiliate Ad Launch Studio to production via GitHub and Vercel.

## 🎯 Pre-Deployment Checklist

### 1. Local Development ✓

- [ ] Application runs locally without errors
  ```bash
  npm run dev
  # Visit http://localhost:3000
  ```

- [ ] All 11 agents are accessible
  - [ ] Marketing Strategist
  - [ ] Creative Strategist
  - [ ] Video Director
  - [ ] Designer
  - [ ] Prompt Generator
  - [ ] Copywriter
  - [ ] Media Buyer
  - [ ] Data Ops
  - [ ] Compliance
  - [ ] Competitor Analysis
  - [ ] Campaign Scheduler

- [ ] Main Data Hub loads correctly
- [ ] Weekly Reports page displays
- [ ] Navigation works between all pages
- [ ] Google authentication works locally

### 2. Environment Configuration ✓

- [ ] `.env` file created with correct values
  ```env
  VITE_AGENT_WORKER=https://your-worker.workers.dev
  VITE_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com
  ```

- [ ] `.env` is listed in `.gitignore`
- [ ] `.env.example` exists with template values
- [ ] Environment variables are valid and tested

### 3. Build Test ✓

- [ ] Type checking passes
  ```bash
  npm run type-check
  ```

- [ ] Production build succeeds
  ```bash
  npm run build
  ```

- [ ] Build output in `dist/` directory
- [ ] Preview build works locally
  ```bash
  npm run preview
  # Visit http://localhost:3000
  ```

- [ ] No console errors in preview

### 4. Code Quality ✓

- [ ] No TypeScript errors
- [ ] No ESLint warnings (critical ones)
- [ ] All imports are correct
- [ ] No unused dependencies
- [ ] No hardcoded secrets in code

### 5. Google OAuth Setup ✓

- [ ] Google Cloud Project created
- [ ] OAuth 2.0 Client ID created
- [ ] Authorized JavaScript origins set:
  - [ ] `http://localhost:3000` (development)
  - [ ] Your production domain (will add after Vercel)
- [ ] Client ID added to `.env`
- [ ] Login flow works locally

### 6. Cloudflare Worker Setup ✓

- [ ] Worker deployed to Cloudflare
- [ ] Worker URL copied
- [ ] Gemini API key added to Worker secrets
- [ ] Worker tested independently
  ```bash
  curl https://your-worker.workers.dev/health
  ```
- [ ] CORS configured for your domain
- [ ] Worker URL added to `.env`

## 📦 GitHub Setup Checklist

### 1. Repository Preparation ✓

- [ ] Git initialized
  ```bash
  git init
  ```

- [ ] All files staged
  ```bash
  git add .
  ```

- [ ] Initial commit created
  ```bash
  git commit -m "Initial commit: Affiliate Ad Launch Studio v1.0.0"
  ```

- [ ] `.env` is NOT in repository
- [ ] `.gitignore` is working correctly

### 2. GitHub Repository ✓

- [ ] GitHub account ready
- [ ] Repository created on GitHub
  - Name: `affiliate-ad-launch-studio`
  - Description: "Professional advertising campaign management platform"
  - Visibility: Public or Private

- [ ] Repository URL copied

### 3. Push to GitHub ✓

- [ ] Remote added
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio.git
  ```

- [ ] Code pushed to main
  ```bash
  git branch -M main
  git push -u origin main
  ```

- [ ] All files visible on GitHub
- [ ] README displays correctly

### 4. GitHub Configuration ✓

- [ ] Repository description set
- [ ] Topics added (optional):
  - `react`, `typescript`, `vite`, `affiliate-marketing`
  - `ai`, `google-gemini`, `cloudflare-workers`

- [ ] README badges added (optional)
- [ ] License file present

## 🚀 Vercel Deployment Checklist

### 1. Vercel Account Setup ✓

- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Permissions granted

### 2. Import Project ✓

- [ ] Project imported from GitHub
- [ ] Repository selected: `affiliate-ad-launch-studio`
- [ ] Import confirmed

### 3. Project Configuration ✓

- [ ] Framework Preset: **Vite** (auto-detected)
- [ ] Root Directory: `./` (default)
- [ ] Build Command: `npm run build` (auto-detected)
- [ ] Output Directory: `dist` (auto-detected)
- [ ] Install Command: `npm install` (auto-detected)

### 4. Environment Variables ✓

Add in Vercel dashboard:

- [ ] `VITE_AGENT_WORKER`
  - Value: `https://your-worker.workers.dev`
  - Environments: ✓ Production ✓ Preview ✓ Development

- [ ] `VITE_GOOGLE_CLIENT_ID`
  - Value: `your-id.apps.googleusercontent.com`
  - Environments: ✓ Production ✓ Preview ✓ Development

### 5. Deploy ✓

- [ ] "Deploy" button clicked
- [ ] Deployment started
- [ ] Build logs checked for errors
- [ ] Deployment successful
- [ ] Deployment URL copied (e.g., `https://your-app.vercel.app`)

### 6. Post-Deployment ✓

- [ ] Visit deployment URL
- [ ] App loads without errors
- [ ] Login page displays
- [ ] No 404 errors on page refresh

## 🔧 Post-Deployment Configuration

### 1. Update Google OAuth ✓

- [ ] Go to Google Cloud Console
- [ ] Add Vercel URL to authorized origins:
  - [ ] `https://your-app.vercel.app`
  - [ ] Your custom domain (if applicable)
- [ ] Save changes
- [ ] Test Google login on deployed app

### 2. Update Cloudflare Worker ✓

- [ ] Update Worker CORS to allow Vercel domain
  ```javascript
  const allowedOrigins = [
    'http://localhost:3000',
    'https://your-app.vercel.app'
  ];
  ```
- [ ] Redeploy Worker
- [ ] Test agent requests from deployed app

### 3. Custom Domain (Optional) ✓

- [ ] Domain purchased/available
- [ ] Added in Vercel: Settings → Domains
- [ ] DNS configured
- [ ] SSL certificate issued (automatic)
- [ ] Domain working
- [ ] Google OAuth updated with custom domain
- [ ] Worker CORS updated with custom domain

## ✅ Verification Checklist

### 1. Application Functionality ✓

- [ ] **Login Page**
  - [ ] Loads without errors
  - [ ] "Sign in with Google" button visible
  - [ ] Button clickable

- [ ] **Authentication**
  - [ ] Google login popup opens
  - [ ] Can select Google account
  - [ ] Redirects back to app
  - [ ] User logged in successfully

- [ ] **Navigation**
  - [ ] Sidebar loads
  - [ ] All navigation items visible
  - [ ] Clicking navigation works
  - [ ] Active page highlighted

- [ ] **Main Data Hub**
  - [ ] Page loads
  - [ ] Data displays (if any)
  - [ ] No console errors

- [ ] **Weekly Reports**
  - [ ] Page loads
  - [ ] Reports display (if any)
  - [ ] No console errors

- [ ] **Agent Pages** (test at least 3)
  - [ ] Marketing Strategist loads
  - [ ] Chat interface displays
  - [ ] Can type message
  - [ ] Send button works
  - [ ] Receives AI response
  - [ ] Response displays correctly

### 2. Routing & SPA ✓

- [ ] Direct URL access works (e.g., `/agents/marketing-strategist`)
- [ ] Page refresh doesn't cause 404
- [ ] Browser back/forward works
- [ ] URL updates on navigation

### 3. Performance ✓

- [ ] Page load time < 3 seconds
- [ ] No layout shift on load
- [ ] Smooth transitions
- [ ] Responsive on mobile

### 4. Console & Network ✓

- [ ] No console errors
- [ ] No 404 network requests
- [ ] API calls successful
- [ ] No CORS errors

## 🐛 Troubleshooting Checklist

If issues occur, check:

### Build Failures

- [ ] Check Vercel build logs
- [ ] Verify all dependencies in `package.json`
- [ ] Ensure TypeScript compiles locally
- [ ] Check for syntax errors

### Runtime Errors

- [ ] Check browser console
- [ ] Verify environment variables set in Vercel
- [ ] Test Worker URL directly
- [ ] Check Worker logs in Cloudflare

### Authentication Issues

- [ ] Verify Google Client ID in Vercel
- [ ] Check authorized origins in Google Console
- [ ] Test with incognito/private window
- [ ] Clear browser cache

### 404 Errors

- [ ] Check `vercel.json` rewrites configuration
- [ ] Verify `dist/index.html` exists in build
- [ ] Check Vercel output directory setting

## 📊 Monitoring Setup (Optional)

- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Uptime monitoring set up
- [ ] Performance monitoring active

## 🔒 Security Checklist

- [ ] No API keys in client-side code
- [ ] Environment variables properly secured
- [ ] CORS properly configured
- [ ] OAuth redirect URIs restricted
- [ ] HTTPS enforced (automatic on Vercel)

## 📝 Documentation Updates

- [ ] README updated with:
  - [ ] Live deployment URL
  - [ ] Deployment status badge
  - [ ] Updated screenshots (optional)

- [ ] Update repository description with live URL
- [ ] Create GitHub release v1.0.0
- [ ] Tag current commit

## 🎉 Launch Checklist

### Pre-Launch

- [ ] All above checklists completed
- [ ] Team tested the application
- [ ] Performance benchmarked
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing done

### Launch

- [ ] Deployment URL shared
- [ ] Users notified
- [ ] Monitor for issues
- [ ] Have rollback plan ready

### Post-Launch

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Plan next iteration

## 📞 Support Resources

If you encounter issues:

1. **Check Documentation**
   - `TROUBLESHOOTING.md`
   - `VERCEL_DEPLOYMENT.md`
   - `GITHUB_SETUP.md`

2. **Logs & Debugging**
   - Vercel deployment logs
   - Browser console
   - Cloudflare Worker logs
   - Network tab

3. **Community**
   - GitHub Issues
   - Vercel Support
   - Stack Overflow

## 🔄 Continuous Deployment

After initial deployment:

- [ ] GitHub Actions workflow configured (optional)
- [ ] Auto-deploy on push to main enabled
- [ ] Preview deployments for PRs enabled
- [ ] Deployment notifications set up

## ✨ Success Indicators

You've successfully deployed when:

- ✅ App accessible at Vercel URL
- ✅ Google authentication works
- ✅ All agents respond to messages
- ✅ No console errors
- ✅ Routing works correctly
- ✅ Mobile responsive
- ✅ Fast load times

## 📈 Next Steps

After successful deployment:

1. **Share**: Share URL with users
2. **Monitor**: Watch for errors and performance
3. **Iterate**: Plan features and improvements
4. **Scale**: Optimize for more users
5. **Maintain**: Keep dependencies updated

---

**Congratulations on your deployment! 🎉**

For ongoing updates, see `TROUBLESHOOTING.md` and `CONFIGURATION_GUIDE.md`.
