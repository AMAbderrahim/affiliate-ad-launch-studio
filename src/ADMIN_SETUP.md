# Admin Setup Guide

This guide is for the admin to set up the production environment.

## Prerequisites

- Cloudflare account with Worker deployed
- Google Cloud account
- Hosting platform (Vercel/Netlify/etc.)

## 1. Cloudflare Worker Setup

### Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **Get API Key** or **Create API Key**
3. Select your Google Cloud project (or create a new one)
4. Copy the API key

### Configure Worker

Your worker should already be deployed. Make sure it:
- Accepts POST requests to `/agent`
- Has GEMINI_API_KEY set as secret (Google AI Studio API key)
- Returns responses in this format:
  ```json
  {
    "reply": "text response",
    "structured": { ... },
    "logs": ["log1", "log2"]
  }
  ```

Worker URL example: `https://affiliate-ad-worker.YOUR_NAME.workers.dev/agent`

### Set Worker Secret

```bash
# Navigate to your worker directory
cd worker-directory

# Add the Gemini API key as a secret
wrangler secret put GEMINI_API_KEY
# Paste your API key when prompted

# Deploy or redeploy
wrangler deploy
```

**Note:** A complete worker example is provided in `worker-example.js` in this repository.

## 2. Google OAuth Setup

### Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: "Affiliate Ad Studio"
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add **Authorized JavaScript origins**:
   - `http://localhost:3000` (for development)
   - `https://your-production-domain.com`
7. **Authorized redirect URIs**: Not needed for Google Sign-In
8. Click **Create**
9. Copy the **Client ID**

### Configure the App

Create `.env.local` from the example:
```bash
# Copy the example file
cp .env.example .env.local

# Edit and fill in your values
nano .env.local
```

Your `.env.local` should look like:
```bash
REACT_APP_AGENT_WORKER=https://your-worker.workers.dev/agent
REACT_APP_GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnop.apps.googleusercontent.com
```

**Important Notes:**
- `.env.local` is gitignored (won't be committed)
- Both values are REQUIRED for the app to work
- Client ID must match exactly from Google Console
- Make sure there are no spaces or quotes around values

## 3. Development Testing

```bash
npm install
npm start
```

Visit `http://localhost:3000` and test:
- ✅ Google sign-in works
- ✅ Agents can call worker
- ✅ Chat panel responds
- ✅ All 11 agents function

## 4. Production Deployment

### Build

```bash
npm run build
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `REACT_APP_AGENT_WORKER`
   - `REACT_APP_GOOGLE_CLIENT_ID`
4. Deploy

### Update Google OAuth

Add your production domain to authorized origins:
1. Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add `https://your-domain.com` to authorized JavaScript origins
4. Save

## 5. Verify Production

Test checklist:
- [ ] App loads at production URL
- [ ] Google sign-in works
- [ ] Create a test campaign
- [ ] Run Marketing Strategist agent
- [ ] Check worker is being called (check Cloudflare logs)
- [ ] Chat panel works
- [ ] All agents unlock sequentially

## 6. Monitoring

### Cloudflare Worker Logs
```bash
wrangler tail
```

### Check API Usage
- Google AI Studio: https://aistudio.google.com/app/apikey

### Set Billing Alerts
- Monitor Gemini API usage in Google Cloud Console
- Set up billing alerts in Google Cloud
- Monitor daily usage

## 7. User Management

Users authenticate via Google. To restrict access:

### Option A: Email Whitelist (in worker)
```javascript
const ALLOWED_EMAILS = [
  'user1@example.com',
  'user2@example.com'
];

// In worker
const userEmail = request.headers.get('X-User-Email');
if (!ALLOWED_EMAILS.includes(userEmail)) {
  return new Response('Unauthorized', { status: 403 });
}
```

### Option B: Google Workspace Domain
Only allow users from your domain in Google OAuth settings.

## 8. Maintenance

### Update Worker
```bash
cd worker-directory
wrangler deploy
```

### Update Frontend
```bash
git pull
npm run build
# Deploy via Vercel/Netlify
```

### Monitor Costs
- Weekly: Check Gemini API usage
- Monthly: Review total costs
- Adjust rate limits if needed

## Troubleshooting

### Google Sign-In Not Working
- Check Client ID is correct
- Verify domain is in authorized origins
- Check browser console for errors

### Worker Connection Failed
- Verify worker is deployed: `wrangler deployments list`
- Check CORS headers are set
- Test worker directly with curl

### High API Costs
- Check Cloudflare logs for excessive requests
- Implement rate limiting
- Consider using Gemini Flash model for faster, cheaper responses

## Security Best Practices

1. ✅ Keep Worker API keys in Cloudflare secrets
2. ✅ Use environment variables for sensitive data
3. ✅ Enable HTTPS only
4. ✅ Restrict CORS to your domain
5. ✅ Monitor API usage regularly
6. ✅ Implement rate limiting in worker
7. ✅ Keep dependencies updated

## Support

For issues:
1. Check browser console
2. Check Cloudflare Worker logs
3. Verify environment variables
4. Test worker endpoint directly

---

**Admin Only** - Keep this file private and secure.