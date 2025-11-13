# Build & Deployment Guide

This project is configured as a Vite-based Single Page Application (SPA) with the build output directory set to `dist`.

## 🏗️ Build Configuration

### Vite Config
- **Build Output**: `dist/`
- **Source Maps**: Disabled in production
- **Code Splitting**: Enabled with vendor chunks for React and UI libraries
- **SPA Mode**: History API fallback enabled

## 📦 Build Commands

### Development
```bash
npm run dev
```
Starts the development server on `http://localhost:3000` with hot module replacement.

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

### Type Checking
```bash
npm run type-check
```
Runs TypeScript type checking without emitting files.

## 🚀 Deployment Options

### Vercel
The project includes `vercel.json` configuration:
- **Output Directory**: `dist`
- **SPA Rewrites**: All routes redirect to `/index.html`
- **Asset Caching**: 1-year cache for static assets

**Deploy Steps:**
1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel
3. Add environment variables:
   - `VITE_AGENT_WORKER`
   - `VITE_GOOGLE_CLIENT_ID`
4. Deploy

### Netlify
The project includes `netlify.toml` configuration:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **SPA Redirects**: Configured via `_redirects` file

**Deploy Steps:**
1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Netlify
3. Add environment variables in Netlify dashboard
4. Deploy

### Manual/Self-Hosted

#### Build Locally
```bash
npm install
npm run build
```

#### Serve with Node.js
```bash
npm install -g serve
serve -s dist -l 3000
```

#### Serve with Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Serve with Apache
Create `.htaccess` in `dist/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Docker
Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:
```bash
docker build -t affiliate-ad-studio .
docker run -p 80:80 affiliate-ad-studio
```

## 🔧 Environment Variables

### Required Variables
Both must be set before building for production:

```env
VITE_AGENT_WORKER=https://your-worker.your-subdomain.workers.dev
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Setting Variables by Platform

**Vercel**: Dashboard → Settings → Environment Variables
**Netlify**: Dashboard → Site Settings → Environment Variables
**Local**: Create `.env` file in root (see `.env.example`)

## 📊 Build Output

After running `npm run build`, the `dist/` directory will contain:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   ├── react-vendor-[hash].js
│   └── ui-vendor-[hash].js
└── vite.svg
```

## 🔍 Build Optimization

The build is optimized with:
- **Code Splitting**: Vendor chunks separated from app code
- **Tree Shaking**: Unused code automatically removed
- **Minification**: JavaScript and CSS minified
- **Asset Optimization**: Images and fonts optimized
- **Lazy Loading**: Route-based code splitting ready

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Restart dev server after adding variables
- Check `.env` file is in project root
- Verify variables are set in deployment platform

### 404 Errors After Deployment
- Check SPA rewrite configuration
- Verify `_redirects` file is in `public/` folder
- Check deployment platform's SPA settings

### Routing Issues
- Ensure React Router is configured with `BrowserRouter`
- Check all routes are defined in App.tsx
- Verify server-side rewrites are working

## 📝 Notes

- Always run `npm run type-check` before building
- Test production build locally with `npm run preview`
- Environment variables are embedded at build time
- Different `.env` values require rebuild to take effect
