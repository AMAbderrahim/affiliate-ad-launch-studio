# Cloudflare Worker Setup Guide - Gemini Integration

This guide walks you through setting up a Cloudflare Worker to integrate Google Gemini API with the Affiliate Ad Launch Studio.

## Overview

The Cloudflare Worker acts as a secure proxy between your frontend application and the Google Gemini API. This architecture keeps your API keys safe and allows you to add rate limiting, monitoring, and other server-side logic.

## Architecture

```
Frontend App (React)
    ↓
Worker Service (workerService.tsx)
    ↓
Cloudflare Worker (Edge)
    ↓
Google Gemini API
```

## Prerequisites

- Cloudflare account (free tier works)
- Google AI Studio API key
- Node.js and npm installed
- Wrangler CLI

## Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Get API Key** or **Create API Key**
4. Select your Google Cloud project (or create a new one)
5. Copy the generated API key
6. Keep it safe - you'll need it in Step 4

## Step 2: Install Wrangler CLI

```bash
npm install -g wrangler
```

Verify installation:
```bash
wrangler --version
```

## Step 3: Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

## Step 4: Create Your Worker

### Create a new directory for your worker

```bash
mkdir affiliate-ad-worker
cd affiliate-ad-worker
```

### Initialize the worker

```bash
wrangler init
```

When prompted:
- Name: `affiliate-ad-worker` (or your preferred name)
- Would you like to use TypeScript? `No` (we'll use JavaScript)
- Would you like to create a Worker? `Yes`

### Copy the worker code

Copy the contents of `worker-example.js` from this repository into your worker's main file (usually `src/index.js` or `worker.js`).

Or create it manually:

```bash
cp path/to/worker-example.js src/index.js
```

### Configure wrangler.toml

Edit `wrangler.toml`:

```toml
name = "affiliate-ad-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[env.production]
name = "affiliate-ad-worker"
```

### Set your API key as a secret

```bash
wrangler secret put GEMINI_API_KEY
```

When prompted, paste your Google AI Studio API key.

**Important:** Never commit your API key to git. Always use Wrangler secrets.

## Step 5: Deploy Your Worker

```bash
wrangler deploy
```

After deployment, you'll see your worker URL:
```
https://affiliate-ad-worker.YOUR_ACCOUNT.workers.dev
```

## Step 6: Test Your Worker

Test with curl:

```bash
curl -X POST https://affiliate-ad-worker.YOUR_ACCOUNT.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "role": "marketing_strategist",
    "system": "You are a marketing strategist.",
    "input": "Create a target audience for a health supplement.",
    "campaignData": {
      "product": "Digestive Health Supplement"
    }
  }'
```

You should get a JSON response with `reply`, `structured`, and `logs` fields.

## Step 7: Configure Your Frontend

Update your `.env.local` file:

```bash
REACT_APP_AGENT_WORKER=https://affiliate-ad-worker.YOUR_ACCOUNT.workers.dev
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

## Step 8: Update CORS (Production Only)

For production, update the CORS headers in your worker to only allow your domain:

```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',  // Change from '*'
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
```

## Customization Options

### Using Gemini Pro Instead of Flash

In your worker code, change:
```javascript
`${GEMINI_API_URL}/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`
```

to:
```javascript
`${GEMINI_API_URL}/gemini-1.5-pro:generateContent?key=${env.GEMINI_API_KEY}`
```

**Comparison:**
- **Gemini Flash**: Faster, cheaper, good for most tasks (~$0.10/campaign)
- **Gemini Pro**: More powerful, better reasoning, higher cost (~$0.50/campaign)

### Adjusting Generation Parameters

In your worker, modify the `generationConfig`:

```javascript
generationConfig: {
  temperature: 0.7,      // 0.0-1.0: Lower = more focused, Higher = more creative
  topK: 40,              // Limits token sampling
  topP: 0.95,            // Nucleus sampling parameter
  maxOutputTokens: 8192, // Maximum response length
}
```

### Adding Rate Limiting

Add rate limiting to prevent abuse:

```javascript
// At the top of your worker
const RATE_LIMIT = 100; // requests per minute

// In the fetch handler, before processing
const clientIP = request.headers.get('CF-Connecting-IP');
// Implement rate limiting logic here
```

### Adding Email Authorization

Restrict access to specific users:

```javascript
const ALLOWED_EMAILS = [
  'admin@yourdomain.com',
  'user@yourdomain.com'
];

// In the fetch handler
const userEmail = request.headers.get('X-User-Email');
if (!ALLOWED_EMAILS.includes(userEmail)) {
  return new Response('Unauthorized', { 
    status: 403,
    headers: corsHeaders 
  });
}
```

## Monitoring and Logging

### View real-time logs

```bash
wrangler tail
```

### View deployment history

```bash
wrangler deployments list
```

### View worker analytics

Visit: https://dash.cloudflare.com/

Navigate to: Workers & Pages → Your Worker → Analytics

## Cost Estimates

### Cloudflare Worker
- Free tier: 100,000 requests/day
- Paid tier: $5/month for 10 million requests

### Google Gemini API
- Gemini Flash: $0.00001/request (very cheap)
- Gemini Pro: $0.00005/request

### Expected Monthly Costs (1000 campaigns)
- Cloudflare: $0 (free tier)
- Gemini Flash: ~$10
- Gemini Pro: ~$50

## Troubleshooting

### "Error: API key not valid"
- Verify your API key in Google AI Studio
- Ensure the key is set correctly with `wrangler secret list`
- Re-set the secret: `wrangler secret put GEMINI_API_KEY`

### "Worker not responding"
- Check worker is deployed: `wrangler deployments list`
- View logs: `wrangler tail`
- Test directly with curl

### "CORS errors in browser"
- Ensure CORS headers are set correctly in worker
- Check the `Access-Control-Allow-Origin` header matches your domain
- Verify the worker URL in `.env.local` is correct

### "Rate limit exceeded"
- Check Google AI Studio quota: https://aistudio.google.com/app/apikey
- Implement caching in your worker
- Consider upgrading to a paid plan

## Security Best Practices

1. ✅ **Never expose API keys** - Always use Wrangler secrets
2. ✅ **Use CORS correctly** - Restrict to your domain in production
3. ✅ **Implement rate limiting** - Prevent abuse
4. ✅ **Monitor usage** - Set up billing alerts
5. ✅ **Use HTTPS only** - Cloudflare handles this automatically
6. ✅ **Validate inputs** - Sanitize all user inputs
7. ✅ **Log suspicious activity** - Monitor for unusual patterns

## Updating Your Worker

### Update code

```bash
# Edit your worker file
nano src/index.js

# Deploy changes
wrangler deploy
```

### Update secrets

```bash
wrangler secret put GEMINI_API_KEY
```

### Rollback if needed

```bash
wrangler rollback
```

## Advanced Configuration

### Custom Domains

1. Go to Cloudflare Dashboard
2. Workers & Pages → Your Worker → Settings
3. Add a custom domain: `api.yourdomain.com`
4. Update `.env.local` to use custom domain

### Environment Variables (Non-Secret)

In `wrangler.toml`:
```toml
[vars]
ENVIRONMENT = "production"
MAX_TOKENS = "8192"
```

Access in worker:
```javascript
env.ENVIRONMENT
env.MAX_TOKENS
```

### Multiple Environments

In `wrangler.toml`:
```toml
[env.staging]
name = "affiliate-ad-worker-staging"

[env.production]
name = "affiliate-ad-worker-production"
```

Deploy to specific environment:
```bash
wrangler deploy --env staging
wrangler deploy --env production
```

## Support and Resources

- Cloudflare Workers Docs: https://developers.cloudflare.com/workers/
- Gemini API Docs: https://ai.google.dev/docs
- Wrangler CLI Docs: https://developers.cloudflare.com/workers/wrangler/
- Google AI Studio: https://aistudio.google.com/

## Need Help?

1. Check worker logs: `wrangler tail`
2. Review Cloudflare dashboard analytics
3. Test with curl to isolate issues
4. Check Google AI Studio quota and billing

---

**Remember:** Keep your API keys secure and never commit them to version control!
