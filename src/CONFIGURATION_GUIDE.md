# Configuration Guide

## Quick Start: Adding Your Credentials

### Step 1: Edit the `.env` File

Open the `.env` file in the root of your project and replace the placeholder values:

```bash
# Replace this with your actual Cloudflare Worker URL
VITE_AGENT_WORKER=https://your-worker-name.your-subdomain.workers.dev

# Replace this with your actual Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

### Step 2: Get Your Cloudflare Worker URL

1. Deploy your Cloudflare Worker (see `WORKER_SETUP.md`)
2. After deployment, you'll get a URL like: `https://affiliate-agents.your-account.workers.dev`
3. Copy this URL into your `.env` file as the `VITE_AGENT_WORKER` value

### Step 3: Get Your Google Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen if prompted
6. Select **Web application** as the application type
7. Add your authorized origins:
   - `http://localhost:5173` (for local development)
   - Your production domain (e.g., `https://yourdomain.com`)
8. Add authorized redirect URIs:
   - `http://localhost:5173` (for local development)
   - Your production domain
9. Click **Create**
10. Copy the **Client ID** (it looks like: `123456789012-abc...xyz.apps.googleusercontent.com`)
11. Paste it into your `.env` file as the `VITE_GOOGLE_CLIENT_ID` value

### Step 4: Restart Your Development Server

After updating the `.env` file, restart your development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
# or
yarn dev
```

## How Configuration Works

### Environment Variable Names

The application uses **Vite-style** environment variables with the `VITE_` prefix:

- `VITE_AGENT_WORKER` - Your Cloudflare Worker endpoint
- `VITE_GOOGLE_CLIENT_ID` - Your Google OAuth Client ID

These are used in:
- **`context/AuthContext.tsx`** - Reads `VITE_GOOGLE_CLIENT_ID` for Google authentication
- **`services/workerService.tsx`** - Reads `VITE_AGENT_WORKER` for agent AI requests

### Fallback Support

The code includes fallbacks for different build systems:
- `VITE_*` - For Vite (current setup)
- `REACT_APP_*` - For Create React App (legacy support)

### Security Notes

⚠️ **Important Security Information:**

1. **Never commit `.env` to version control** - It's already in `.gitignore`
2. **Worker security** - Your Google Gemini API key should ONLY be in the Cloudflare Worker (as a secret), never in this `.env` file
3. **Client ID is public** - The Google Client ID in `.env` is safe to expose in client-side code (it's meant to be public)
4. **Production deployment** - For production, set these environment variables in your hosting platform's dashboard (Vercel, Netlify, etc.)

## Verification

### Check if Configuration is Loaded

You can verify your configuration by checking the browser console:

```javascript
// This should show your worker URL
console.log(import.meta.env.VITE_AGENT_WORKER);

// This should show your Google Client ID
console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
```

### Check Application Status

The application will show errors if:
- **Worker not configured** - You'll see "Worker endpoint not configured" errors when trying to use agents
- **Google Client ID not configured** - Google Sign-In button won't work

## Production Deployment

### Vercel

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add:
   - `VITE_AGENT_WORKER` = your worker URL
   - `VITE_GOOGLE_CLIENT_ID` = your Google Client ID

### Netlify

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Add the same variables as above

### Other Platforms

Most hosting platforms have an environment variables section in their dashboard. Add the `VITE_*` variables there.

## Troubleshooting

### "Worker endpoint not configured"
- Check that `VITE_AGENT_WORKER` is set in `.env`
- Verify you restarted the dev server after changing `.env`
- Ensure the URL is complete and starts with `https://`

### "Google Sign-In not loaded"
- Check that `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Verify the Client ID format (should end with `.apps.googleusercontent.com`)
- Check Google Cloud Console to ensure the OAuth client is active
- Verify your domain is in the authorized origins

### Variables not loading
- Environment variables in Vite must start with `VITE_`
- You must restart the dev server after changing `.env`
- Check that `.env` is in the project root (same level as `package.json`)

## Next Steps

After configuration:
1. ✅ Test Google Sign-In works
2. ✅ Deploy your Cloudflare Worker (see `WORKER_SETUP.md`)
3. ✅ Test an agent to verify worker connection
4. ✅ Review `QUICK_START_CHECKLIST.md` for complete setup

## File Locations

- **`.env`** - Your actual configuration (NOT in git)
- **`.env.example`** - Template file (safe to commit)
- **`.gitignore`** - Prevents `.env` from being committed
- **`env.d.ts`** - TypeScript definitions for environment variables
- **`context/AuthContext.tsx`** - Uses `VITE_GOOGLE_CLIENT_ID`
- **`services/workerService.tsx`** - Uses `VITE_AGENT_WORKER`
