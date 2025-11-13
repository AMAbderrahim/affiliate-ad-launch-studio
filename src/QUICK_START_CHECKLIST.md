# Quick Start Checklist

Use this checklist to get your Affiliate Ad Launch Studio up and running.

## ☑️ Pre-Deployment Checklist

### 1. Gemini API Setup
- [ ] Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] Create or select a Google Cloud project
- [ ] Generate API key
- [ ] Save API key securely (you'll need it for the worker)

### 2. Cloudflare Worker Setup
- [ ] Install Wrangler CLI: `npm install -g wrangler`
- [ ] Login to Cloudflare: `wrangler login`
- [ ] Create worker directory: `mkdir affiliate-ad-worker && cd affiliate-ad-worker`
- [ ] Copy `worker-example.js` content to your worker
- [ ] Set API key secret: `wrangler secret put GEMINI_API_KEY`
- [ ] Deploy worker: `wrangler deploy`
- [ ] Copy worker URL (e.g., `https://your-worker.workers.dev`)
- [ ] Test worker with curl (see WORKER_SETUP.md)

### 3. Google OAuth Setup
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create new project: "Affiliate Ad Studio"
- [ ] Enable Google Sign-In API
- [ ] Create OAuth 2.0 Client ID
- [ ] Add authorized JavaScript origin: `http://localhost:3000`
- [ ] Copy Client ID

### 4. Frontend Configuration
- [ ] Clone the repository
- [ ] Run `npm install`
- [ ] Edit `.env` file in project root (already created)
- [ ] Add worker URL: `VITE_AGENT_WORKER=https://your-worker.workers.dev`
- [ ] Add Google Client ID: `VITE_GOOGLE_CLIENT_ID=your-id.apps.googleusercontent.com`
- [ ] Verify no quotes or spaces in values
- [ ] See `ENVIRONMENT_SETUP.md` for detailed instructions

### 5. Local Testing
- [ ] Run `npm start`
- [ ] Open `http://localhost:3000`
- [ ] Sign in with Google
- [ ] Create a test campaign
- [ ] Run Marketing Strategist agent
- [ ] Verify response from Gemini
- [ ] Test chat panel (CampaignGPT)
- [ ] Check browser console for errors

## ☑️ Production Deployment Checklist

### 1. Frontend Deployment
- [ ] Build: `npm run build`
- [ ] Deploy to Vercel/Netlify/etc.
- [ ] Add environment variables to hosting platform:
  - [ ] `VITE_AGENT_WORKER` (your Cloudflare Worker URL)
  - [ ] `VITE_GOOGLE_CLIENT_ID` (your Google OAuth Client ID)

### 2. Google OAuth Production Setup
- [ ] Add production domain to authorized JavaScript origins
- [ ] Example: `https://yourdomain.com`
- [ ] Save changes in Google Cloud Console

### 3. Worker Production Setup
- [ ] Update CORS in worker to use your domain (not `*`)
- [ ] Redeploy worker: `wrangler deploy`
- [ ] Test worker from production URL

### 4. Production Testing
- [ ] Visit production URL
- [ ] Test Google sign-in
- [ ] Create test campaign
- [ ] Run all 11 agents
- [ ] Test chat functionality
- [ ] Verify reports export
- [ ] Check Cloudflare Worker logs: `wrangler tail`

### 5. Monitoring Setup
- [ ] Set up billing alerts in Google Cloud Console
- [ ] Monitor Gemini API usage at [Google AI Studio](https://aistudio.google.com/app/apikey)
- [ ] Check Cloudflare Worker analytics
- [ ] Set cost alerts ($50, $100, $200/month)

## ☑️ Security Checklist

- [ ] Gemini API key is stored in Cloudflare Worker secrets (not in code)
- [ ] `.env` file is in `.gitignore` (already configured)
- [ ] CORS is configured for production domain only
- [ ] HTTPS is enabled (automatic on most platforms)
- [ ] Google OAuth is restricted to your domain
- [ ] Rate limiting is implemented in worker (optional but recommended)
- [ ] Email whitelist is configured if needed (optional)

## ☑️ Optional Enhancements

- [ ] Add custom domain to Cloudflare Worker
- [ ] Implement rate limiting in worker
- [ ] Add user email authorization in worker
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure Google Analytics
- [ ] Add staging environment
- [ ] Set up automated backups
- [ ] Create admin dashboard for monitoring

## 📊 Success Metrics

After deployment, verify:
- [ ] Users can sign in within 3 seconds
- [ ] Agents respond within 5-10 seconds
- [ ] No errors in browser console
- [ ] No errors in Cloudflare Worker logs
- [ ] Cost per campaign is under $1
- [ ] All 11 agents produce valid output

## 🆘 If Something Goes Wrong

### Sign-in not working?
→ Check TROUBLESHOOTING.md section "Google Sign-In Not Working"

### Worker not responding?
→ Check WORKER_SETUP.md section "Troubleshooting"

### Agents not generating responses?
→ Check ADMIN_SETUP.md section "Troubleshooting"

### High API costs?
→ See GEMINI_MIGRATION.md section "Cost Optimization"

## 📚 Documentation Quick Links

- **Environment Config:** [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) ⭐ Start here!
- **Configuration Guide:** [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)
- **Admin Setup:** [ADMIN_SETUP.md](ADMIN_SETUP.md)
- **Worker Setup:** [WORKER_SETUP.md](WORKER_SETUP.md)
- **Migration Info:** [GEMINI_MIGRATION.md](GEMINI_MIGRATION.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**Estimated Setup Time:** 30-60 minutes

**Ready to deploy?** Start with step 1 above and check off items as you go!
