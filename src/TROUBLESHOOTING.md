# Troubleshooting Guide

## Google Sign-In Issues

### Error: "Failed to render button before calling initialize()"

**Cause:** The Google Sign-In button tried to render before the library was initialized.

**Solution:** This has been fixed in the code. The button now waits for initialization. If you still see this:
1. Clear your browser cache
2. Restart the development server: `npm start`
3. Hard refresh the page: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### Error: "Missing required parameter: client_id"

**Cause:** Google Client ID is not configured or not loading.

**Solution:**
1. Verify `.env.local` exists in the project root
2. Check the file contains: `REACT_APP_GOOGLE_CLIENT_ID=your-id-here`
3. Make sure there are NO quotes around the value
4. Make sure there are NO spaces around the `=` sign
5. Restart the development server
6. Verify by running: `cat .env.local` (should show your variables)

**Correct format:**
```bash
REACT_APP_GOOGLE_CLIENT_ID=1234567890-abc123.apps.googleusercontent.com
```

**Incorrect formats:**
```bash
REACT_APP_GOOGLE_CLIENT_ID = "1234567890-abc123.apps.googleusercontent.com"  # ❌ Has quotes and spaces
REACT_APP_GOOGLE_CLIENT_ID='1234567890-abc123.apps.googleusercontent.com'     # ❌ Has quotes
REACT_APP_GOOGLE_CLIENT_ID = 1234567890-abc123.apps.googleusercontent.com    # ❌ Has spaces
```

### Google Sign-In Button Not Appearing

**Symptoms:** You see a loading spinner that never completes.

**Solution:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify your Client ID is correct:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - APIs & Services → Credentials
   - Copy the exact Client ID
4. Make sure `http://localhost:3000` is in authorized JavaScript origins
5. Try incognito/private mode

### Sign-In Popup Blocked

**Cause:** Browser is blocking the Google popup.

**Solution:**
1. Allow popups for `localhost:3000`
2. Click the address bar icon to allow popups
3. Try again

## Environment Variable Issues

### Variables Not Loading

**Check 1: File Location**
```bash
# .env.local must be in project root
ls -la .env.local
```

**Check 2: File Content**
```bash
# Should show your variables
cat .env.local
```

**Check 3: Server Running**
- Environment variables are loaded at server start
- Changes require server restart
- Kill server (Ctrl+C) and run `npm start` again

### Using Vite instead of Create React App?

If you're using Vite, use `VITE_` prefix instead:
```bash
VITE_AGENT_WORKER=https://your-worker.workers.dev/agent
VITE_GOOGLE_CLIENT_ID=your-client-id
```

## Network Issues

### Google Sign-In Script Not Loading

**Check:**
1. Internet connection is working
2. Can access https://accounts.google.com/gsi/client
3. Firewall/antivirus not blocking Google domains
4. Not behind corporate proxy that blocks Google

**Test:**
```bash
# Should return HTML/JavaScript
curl https://accounts.google.com/gsi/client
```

## Development Server Issues

### Port 3000 Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm start
```

**Note:** If using a different port, update Google OAuth origins!

### Module Not Found Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Google Cloud Console Issues

### Authorized Origins Not Saving

**Solution:**
1. Make sure you click "Save" after adding origins
2. Wait 1-2 minutes for changes to propagate
3. Try hard refresh in your app

### Client ID Shows "Restricted"

**Cause:** OAuth consent screen not configured.

**Solution:**
1. Go to OAuth consent screen
2. Fill in app name, support email
3. Add test users if in "Testing" mode
4. Save and try again

## Browser Compatibility

### Supported Browsers
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ❌ IE11 (not supported)

### Clear Browser Data
If sign-in is acting strange:
1. Clear cache and cookies for localhost
2. Try incognito/private mode
3. Try different browser

## Still Having Issues?

### Debugging Checklist

```bash
# 1. Check environment file
cat .env.local

# 2. Verify variables are set (should show your values)
echo $REACT_APP_GOOGLE_CLIENT_ID  # Note: might not work in terminal

# 3. Check setup
bash check-setup.sh  # or: sh check-setup.sh

# 4. Restart server
npm start
```

### Enable Verbose Logging

Open browser console (F12) → Console tab

You should see:
- No red errors
- Google library loading
- Authentication flow messages

### Common Console Errors

**"Failed to load resource: net::ERR_BLOCKED_BY_CLIENT"**
- AdBlock is blocking Google Sign-In
- Disable AdBlock for localhost

**"Cross-origin request blocked"**
- Check authorized JavaScript origins in Google Console
- Make sure you added the correct domain

**"Cookie blocked"**
- Check browser cookie settings
- Allow third-party cookies for localhost

## Getting Help

If none of these solutions work:

1. Check browser console for errors
2. Check network tab for failed requests
3. Verify all prerequisites are met
4. Review `ADMIN_SETUP.md` for detailed setup
5. Double-check Google Cloud Console configuration

## Quick Reset

Start fresh:
```bash
# 1. Stop server
Ctrl+C

# 2. Clear environment
rm .env.local

# 3. Start over
cp .env.example .env.local
nano .env.local  # Add your values

# 4. Restart
npm start
```

---

**Most issues are fixed by:**
1. ✅ Verifying `.env.local` exists and has correct values
2. ✅ Restarting the development server
3. ✅ Hard refreshing the browser
4. ✅ Checking Google Cloud Console authorized origins
