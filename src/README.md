# 🚀 Affiliate Ad Launch Studio

A comprehensive web application for affiliate marketers to launch advertising campaigns using an agentized architecture with 11 specialized AI-powered agent pages, a main data hub, navigation system, and weekly reports functionality.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.2-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF?logo=vite)

## ✨ Features

### 🤖 11 Specialized AI Agents
- **Marketing Strategist** - Campaign strategy and planning
- **Creative Strategist** - Creative direction and concepts
- **Video Director** - Video content planning and scripting
- **Designer** - Visual design and branding
- **Prompt Generator** - AI prompt engineering
- **Copywriter** - Ad copy and content creation
- **Media Buyer** - Ad placement and budget optimization
- **Data Ops** - Analytics and data management
- **Compliance** - Legal and compliance checking
- **Competitor Analysis** - Market research and competitive intelligence
- **Campaign Scheduler** - Timeline and schedule management

### 🎯 Core Features
- **Main Data Hub** - Centralized campaign data management
- **Weekly Reports** - Automated campaign performance reports
- **Google Authentication** - Secure OAuth login
- **Cloudflare Worker Integration** - Secure AI agent functionality
- **Google Gemini API** - Advanced AI capabilities with 70-95% cost savings vs OpenAI
- **Responsive Design** - Mobile-friendly interface
- **Real-time Updates** - Live data synchronization

## 🏗️ Tech Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.3.1
- **Styling**: Tailwind CSS 4.0
- **Routing**: React Router DOM 6.26.1
- **UI Components**: Shadcn/ui with Radix UI
- **Icons**: Lucide React
- **Authentication**: Google OAuth
- **AI Backend**: Google Gemini API via Cloudflare Workers
- **State Management**: React Context API

## 📋 Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Google Cloud Project with OAuth 2.0 credentials
- Cloudflare account with Workers access
- Google Gemini API key (deployed in Cloudflare Worker)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/affiliate-ad-launch-studio.git
cd affiliate-ad-launch-studio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_AGENT_WORKER=https://your-worker.your-subdomain.workers.dev
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

See `.env.example` for reference.

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

### 5. Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📁 Project Structure

```
affiliate-ad-launch-studio/
├── public/                      # Static assets
│   ├── _redirects              # SPA routing config
│   ├── robots.txt              # SEO configuration
│   ├── manifest.json           # PWA manifest
│   └── vite.svg                # App logo
├── components/                  # React components
│   ├── agents/                 # 11 specialized agent pages
│   │   ├── MarketingStrategist.tsx
│   │   ├── CreativeStrategist.tsx
│   │   ├── VideoDirector.tsx
│   │   ├── Designer.tsx
│   │   ├── PromptGenerator.tsx
│   │   ├── Copywriter.tsx
│   │   ├── MediaBuyer.tsx
│   │   ├── DataOps.tsx
│   │   ├── Compliance.tsx
│   │   ├── CompetitorAnalysis.tsx
│   │   └── CampaignScheduler.tsx
│   ├── ui/                     # Shadcn UI components
│   ├── AgentChatPanel.tsx      # Shared chat interface
│   ├── AgentLayout.tsx         # Agent page layout
│   ├── Header.tsx              # App header
│   ├── Navigation.tsx          # Sidebar navigation
│   ├── LoginPage.tsx           # Google OAuth login
│   ├── MainDataHub.tsx         # Data hub page
│   └── WeeklyReports.tsx       # Reports page
├── context/                     # React Context providers
│   ├── AuthContext.tsx         # Authentication state
│   └── CampaignContext.tsx     # Campaign data state
├── services/                    # API services
│   ├── workerService.tsx       # Cloudflare Worker client
│   └── llmService.tsx          # LLM interaction service
├── styles/                      # Global styles
│   └── globals.css             # Tailwind + custom CSS
├── guidelines/                  # Project documentation
├── App.tsx                      # Root component
├── main.tsx                     # App entry point
├── index.html                   # HTML template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── vercel.json                 # Vercel deployment config
├── netlify.toml                # Netlify deployment config
└── .env.example                # Environment variables template
```

## 🔐 Authentication Setup

### Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://your-domain.com` (production)
6. Copy the Client ID to your `.env` file

See `WHERE_TO_ADD_CREDENTIALS.md` for detailed instructions.

## ⚙️ Cloudflare Worker Setup

The application uses Cloudflare Workers to securely handle AI agent requests.

### Deploy Worker

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

3. Deploy the worker (see `worker-example.js`):
```bash
wrangler deploy
```

4. Add your Google Gemini API key as a Worker secret:
```bash
wrangler secret put GEMINI_API_KEY
```

See `WORKER_SETUP.md` for complete instructions.

## 🌐 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables:
   - `VITE_AGENT_WORKER`
   - `VITE_GOOGLE_CLIENT_ID`
4. Deploy

The `vercel.json` configuration is already set up for SPA routing.

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Push your code to GitHub
2. Import the repository in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

The `netlify.toml` configuration is already set up.

### Manual Deployment

```bash
# Build the app
npm run build

# The dist/ folder contains your production-ready app
# Upload it to any static hosting service
```

See `BUILD_DEPLOYMENT.md` for more deployment options.

## 📚 Documentation

- **[START_HERE.md](START_HERE.md)** - Complete getting started guide
- **[CHEAT_SHEET.md](CHEAT_SHEET.md)** - Quick reference guide
- **[GEMINI_MIGRATION.md](GEMINI_MIGRATION.md)** - Google Gemini API migration guide
- **[WORKER_SETUP.md](WORKER_SETUP.md)** - Cloudflare Worker setup
- **[BUILD_DEPLOYMENT.md](BUILD_DEPLOYMENT.md)** - Build and deployment guide
- **[CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)** - Configuration reference
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete documentation index

## 🎨 Customization

### Styling

The app uses Tailwind CSS 4.0. Global styles and design tokens are in `styles/globals.css`.

### Adding New Agents

1. Create a new component in `components/agents/`
2. Use the `AgentLayout` component for consistent UI
3. Add route in `App.tsx`
4. Add navigation item in `Navigation.tsx`

### Modifying Agent Behavior

Agent configurations are managed through the worker service. See `services/workerService.tsx`.

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
npm run lint         # ESLint code linting
```

### Code Quality

- TypeScript strict mode enabled
- ESLint configured with React rules
- Automatic type checking on build

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_AGENT_WORKER` | Cloudflare Worker URL for AI agents | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes |

## 💰 Cost Optimization

This project uses Google Gemini API instead of OpenAI for:
- **70-95% cost savings** on API calls
- **Better performance** for most tasks
- **Higher rate limits** for production use

See `GEMINI_MIGRATION.md` for migration details and cost comparisons.

## 🐛 Troubleshooting

### Common Issues

**Build fails**: Clear cache and reinstall dependencies
```bash
rm -rf node_modules dist
npm install
npm run build
```

**Environment variables not working**: Ensure they start with `VITE_` and restart dev server

**Authentication errors**: Check Google OAuth configuration and credentials

See `TROUBLESHOOTING.md` for more solutions.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Check the documentation in the `/` directory
- Review `TROUBLESHOOTING.md`
- Open an issue on GitHub

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Powered by [Google Gemini API](https://ai.google.dev/)
- Hosted on [Vercel](https://vercel.com/)

---

Made with ❤️ for affiliate marketers
