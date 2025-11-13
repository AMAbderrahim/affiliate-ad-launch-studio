# 📁 Project Structure

Complete overview of the Affiliate Ad Launch Studio file and folder structure.

## 🌳 Directory Tree

```
affiliate-ad-launch-studio/
│
├── 📁 .github/                          # GitHub configuration
│   └── workflows/
│       └── deploy.yml                   # GitHub Actions CI/CD workflow
│
├── 📁 components/                       # React components
│   │
│   ├── 📁 agents/                       # 11 Specialized AI Agents
│   │   ├── CampaignScheduler.tsx       # Campaign scheduling & timeline
│   │   ├── CompetitorAnalysis.tsx      # Market research & competitor intel
│   │   ├── Compliance.tsx              # Legal & compliance checking
│   │   ├── Copywriter.tsx              # Ad copy & content creation
│   │   ├── CreativeStrategist.tsx      # Creative direction & concepts
│   │   ├── DataOps.tsx                 # Analytics & data management
│   │   ├── Designer.tsx                # Visual design & branding
│   │   ├── MarketingStrategist.tsx     # Campaign strategy & planning
│   │   ├── MediaBuyer.tsx              # Ad placement & budget optimization
│   │   ├── PromptGenerator.tsx         # AI prompt engineering
│   │   └── VideoDirector.tsx           # Video content planning
│   │
│   ├── 📁 figma/                        # Figma-specific components
│   │   └── ImageWithFallback.tsx       # Protected: Image component
│   │
│   ├── 📁 ui/                           # Shadcn UI Components
│   │   ├── accordion.tsx               # Accordion component
│   │   ├── alert-dialog.tsx            # Alert dialog (accessibility updated)
│   │   ├── alert.tsx                   # Alert notifications
│   │   ├── aspect-ratio.tsx            # Aspect ratio wrapper
│   │   ├── avatar.tsx                  # User avatar
│   │   ├── badge.tsx                   # Badge component
│   │   ├── breadcrumb.tsx              # Breadcrumb navigation
│   │   ├── button.tsx                  # Button component
│   │   ├── calendar.tsx                # Calendar/date picker
│   │   ├── card.tsx                    # Card container
│   │   ├── carousel.tsx                # Carousel/slider
│   │   ├── chart.tsx                   # Chart components (Recharts)
│   │   ├── checkbox.tsx                # Checkbox input
│   │   ├── collapsible.tsx             # Collapsible sections
│   │   ├── command.tsx                 # Command menu
│   │   ├── context-menu.tsx            # Context menu
│   │   ├── dialog.tsx                  # Dialog modal (accessibility updated)
│   │   ├── drawer.tsx                  # Slide-in drawer
│   │   ├── dropdown-menu.tsx           # Dropdown menu
│   │   ├── form.tsx                    # Form components
│   │   ├── hover-card.tsx              # Hover card
│   │   ├── input-otp.tsx               # OTP input
│   │   ├── input.tsx                   # Text input
│   │   ├── label.tsx                   # Form label
│   │   ├── menubar.tsx                 # Menu bar
│   │   ├── navigation-menu.tsx         # Navigation menu
│   │   ├── pagination.tsx              # Pagination
│   │   ├── popover.tsx                 # Popover component
│   │   ├── progress.tsx                # Progress bar
│   │   ├── radio-group.tsx             # Radio button group
│   │   ├── resizable.tsx               # Resizable panels
│   │   ├── scroll-area.tsx             # Custom scrollbar
│   │   ├── select.tsx                  # Select dropdown
│   │   ├── separator.tsx               # Visual separator
│   │   ├── sheet.tsx                   # Sheet modal (accessibility updated)
│   │   ├── sidebar.tsx                 # Sidebar component
│   │   ├── skeleton.tsx                # Loading skeleton
│   │   ├── slider.tsx                  # Range slider
│   │   ├── sonner.tsx                  # Toast notifications
│   │   ├── switch.tsx                  # Toggle switch
│   │   ├── table.tsx                   # Data table
│   │   ├── tabs.tsx                    # Tab navigation
│   │   ├── textarea.tsx                # Multiline text input
│   │   ├── toggle-group.tsx            # Toggle group
│   │   ├── toggle.tsx                  # Toggle button
│   │   ├── tooltip.tsx                 # Tooltip component
│   │   ├── use-mobile.ts               # Mobile detection hook
│   │   └── utils.ts                    # Utility functions
│   │
│   ├── AgentChatPanel.tsx              # Shared chat interface for agents
│   ├── AgentLayout.tsx                 # Layout wrapper for agent pages
│   ├── AgentLoadingState.tsx           # Loading state component
│   ├── Header.tsx                      # Application header
│   ├── LoginPage.tsx                   # Google OAuth login page
│   ├── MainDataHub.tsx                 # Main data hub page
│   ├── Navigation.tsx                  # Sidebar navigation
│   └── WeeklyReports.tsx               # Weekly reports page
│
├── 📁 context/                          # React Context Providers
│   ├── AuthContext.tsx                 # Authentication state management
│   └── CampaignContext.tsx             # Campaign data state management
│
├── 📁 guidelines/                       # Project guidelines
│   └── Guidelines.md                   # Development guidelines
│
├── 📁 public/                           # Static assets (deployed as-is)
│   ├── _redirects                      # Netlify SPA routing
│   ├── favicon.ico                     # Favicon
│   ├── logo192.png                     # 192x192 logo for PWA
│   ├── logo512.png                     # 512x512 logo for PWA
│   ├── manifest.json                   # PWA manifest
│   ├── robots.txt                      # SEO robots file
│   └── vite.svg                        # Vite logo
│
├── 📁 services/                         # API Service Layer
│   ├── llmService.tsx                  # LLM interaction service
│   └── workerService.tsx               # Cloudflare Worker client
│
├── 📁 styles/                           # Global styles
│   └── globals.css                     # Tailwind CSS + custom styles
│
├── 📄 .env.example                      # Environment variables template
├── 📄 .gitignore                        # Git ignore rules
├── 📄 App.tsx                           # Root React component
├── 📄 env.d.ts                          # TypeScript environment declarations
├── 📄 index.html                        # HTML entry point
├── 📄 LICENSE                           # MIT License
├── 📄 main.tsx                          # React app entry point
├── 📄 netlify.toml                      # Netlify deployment config
├── 📄 package.json                      # NPM dependencies & scripts
├── 📄 tsconfig.json                     # TypeScript configuration
├── 📄 vercel.json                       # Vercel deployment config
├── 📄 vite.config.ts                    # Vite build configuration
│
├── 📄 worker-example.js                 # Cloudflare Worker code example
│
└── 📚 Documentation Files
    ├── ADMIN_SETUP.md                  # Admin setup guide
    ├── Attributions.md                 # Third-party attributions
    ├── BUILD_DEPLOYMENT.md             # Build & deployment guide
    ├── CHEAT_SHEET.md                  # Quick reference
    ├── CONFIGURATION_GUIDE.md          # Configuration reference
    ├── CONFIG_SUMMARY.md               # Config summary
    ├── DOCUMENTATION_INDEX.md          # Documentation index
    ├── ENVIRONMENT_SETUP.md            # Environment setup
    ├── GEMINI_MIGRATION.md             # Gemini API migration guide
    ├── GITHUB_SETUP.md                 # GitHub setup guide
    ├── PROJECT_STRUCTURE.md            # This file
    ├── QUICK_START_CHECKLIST.md        # Quick start checklist
    ├── README.md                        # Main documentation
    ├── START_HERE.md                   # Getting started guide
    ├── TROUBLESHOOTING.md              # Troubleshooting guide
    ├── VERCEL_DEPLOYMENT.md            # Vercel deployment guide
    ├── VISUAL_GUIDE.md                 # Visual guide
    ├── WHERE_TO_ADD_CREDENTIALS.md     # Credentials guide
    └── WORKER_SETUP.md                 # Worker setup guide
```

## 📦 Key Directories

### `/components`
Contains all React components organized by function:
- **agents/**: 11 specialized AI agent pages
- **ui/**: 40+ Shadcn UI components
- **figma/**: Figma-specific utilities

### `/context`
React Context providers for global state:
- **AuthContext**: User authentication state
- **CampaignContext**: Campaign data management

### `/services`
API service layer for external integrations:
- **workerService**: Cloudflare Worker API client
- **llmService**: LLM (Gemini) interaction logic

### `/public`
Static assets served directly:
- Images, icons, manifests
- Must be in this folder to be accessible at build time

### `/styles`
Global CSS and Tailwind configuration:
- **globals.css**: All application styles

## 🔧 Configuration Files

### Build & Development

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration, output to `dist/` |
| `tsconfig.json` | TypeScript compiler options |
| `package.json` | Dependencies, scripts, metadata |
| `index.html` | HTML template, entry point |
| `main.tsx` | React app initialization |

### Deployment

| File | Purpose |
|------|---------|
| `vercel.json` | Vercel deployment config (SPA routing) |
| `netlify.toml` | Netlify deployment config |
| `public/_redirects` | Universal SPA redirect file |
| `.github/workflows/deploy.yml` | CI/CD automation |

### Environment

| File | Purpose |
|------|---------|
| `.env.example` | Template for environment variables |
| `.env` | Local environment variables (gitignored) |
| `env.d.ts` | TypeScript definitions for env vars |

### Git

| File | Purpose |
|------|---------|
| `.gitignore` | Files to exclude from Git |
| `LICENSE` | MIT License |

## 📝 Documentation Files

### Getting Started
- `START_HERE.md` - First file to read
- `QUICK_START_CHECKLIST.md` - Quick setup steps
- `README.md` - Main project overview

### Setup Guides
- `ENVIRONMENT_SETUP.md` - Environment configuration
- `WORKER_SETUP.md` - Cloudflare Worker deployment
- `GITHUB_SETUP.md` - GitHub repository setup
- `VERCEL_DEPLOYMENT.md` - Vercel deployment
- `ADMIN_SETUP.md` - Admin configuration

### Reference
- `CHEAT_SHEET.md` - Quick command reference
- `CONFIGURATION_GUIDE.md` - Detailed config options
- `PROJECT_STRUCTURE.md` - This file
- `DOCUMENTATION_INDEX.md` - All docs index

### Migration & Updates
- `GEMINI_MIGRATION.md` - OpenAI to Gemini migration
- `BUILD_DEPLOYMENT.md` - Build system details

### Troubleshooting
- `TROUBLESHOOTING.md` - Common issues & solutions
- `WHERE_TO_ADD_CREDENTIALS.md` - Credential setup

## 🎯 Entry Points

### Development
```
Browser → http://localhost:3000
  ↓
index.html
  ↓
main.tsx (React.render)
  ↓
App.tsx (Routes)
  ↓
Components
```

### Production
```
Browser → https://yourapp.vercel.app
  ↓
dist/index.html (built from index.html)
  ↓
dist/assets/index-[hash].js (built from main.tsx)
  ↓
App component
  ↓
Routes
```

## 🔄 Data Flow

```
User Interaction
  ↓
React Component (e.g., AgentChatPanel)
  ↓
Context (AuthContext, CampaignContext)
  ↓
Service (workerService, llmService)
  ↓
Cloudflare Worker
  ↓
Google Gemini API
  ↓
Response back through chain
  ↓
UI Update
```

## 🚀 Build Output (`/dist`)

After running `npm run build`:

```
dist/
├── index.html                          # Entry HTML
├── vite.svg                            # Vite logo
├── assets/
│   ├── index-[hash].js                # Main app bundle
│   ├── index-[hash].css               # Compiled styles
│   ├── react-vendor-[hash].js         # React libraries
│   └── ui-vendor-[hash].js            # UI libraries
└── [copied public files]               # All public/ files
```

## 📊 File Statistics

- **Total Components**: 50+ React components
- **Agent Pages**: 11 specialized agents
- **UI Components**: 40+ Shadcn components
- **Documentation Files**: 20+ guides
- **Configuration Files**: 10+ config files
- **Lines of Code**: ~15,000+ (estimated)

## 🎨 Asset Organization

### Images
- Place in `/public/` for static access
- Reference as `/image.png` in code
- Auto-copied to `dist/` on build

### Icons
- Using Lucide React library
- Imported from `lucide-react` package
- No local icon files needed

### Fonts
- Defined in `styles/globals.css`
- Can add custom fonts to `/public/fonts/`

## 🔐 Security Files

### Gitignored (Not in Repository)
- `.env` - Local environment variables
- `node_modules/` - Dependencies
- `dist/` - Build output
- `.vercel/` - Vercel CLI data

### Committed (In Repository)
- `.env.example` - Template (no secrets)
- `.gitignore` - Ignore rules
- All source code
- All documentation

## ✅ File Checklist

### Required for Development
- [x] `package.json` - Dependencies defined
- [x] `vite.config.ts` - Build configured
- [x] `tsconfig.json` - TypeScript configured
- [x] `.env` - Environment variables set (local only)
- [x] `main.tsx` - App entry point
- [x] `App.tsx` - Root component

### Required for Deployment
- [x] `vercel.json` - Vercel config
- [x] `public/_redirects` - SPA routing
- [x] `index.html` - HTML template
- [x] Environment variables set in hosting platform

### Required for GitHub
- [x] `.gitignore` - Ignore rules
- [x] `README.md` - Documentation
- [x] `LICENSE` - License file
- [x] `.github/workflows/deploy.yml` - CI/CD

## 🗂️ Folder Naming Conventions

- **Components**: PascalCase (e.g., `AgentChatPanel.tsx`)
- **Directories**: lowercase or kebab-case (e.g., `components`, `ui`)
- **Services**: camelCase with Service suffix (e.g., `workerService.tsx`)
- **Context**: PascalCase with Context suffix (e.g., `AuthContext.tsx`)
- **Documentation**: UPPERCASE.md or PascalCase.md

## 🎯 Import Patterns

### Component Imports
```tsx
// From components
import { Header } from './components/Header';
import { MarketingStrategist } from './components/agents/MarketingStrategist';

// From UI
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';

// From context
import { useAuth } from './context/AuthContext';
import { useCampaign } from './context/CampaignContext';

// From services
import { workerService } from './services/workerService';
```

### Asset Imports
```tsx
// Public assets (static path)
<img src="/logo.png" alt="Logo" />

// CSS
import './styles/globals.css';
```

## 📚 Related Documentation

- **Full Setup**: See `START_HERE.md`
- **Deployment**: See `VERCEL_DEPLOYMENT.md`
- **Configuration**: See `CONFIGURATION_GUIDE.md`
- **All Docs**: See `DOCUMENTATION_INDEX.md`

---

This structure is optimized for Vite builds and Vercel deployments.
