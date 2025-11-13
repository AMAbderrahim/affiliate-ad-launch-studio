# 📦 GitHub Setup Guide

Complete guide for setting up and managing your Affiliate Ad Launch Studio on GitHub.

## 🎯 Initial Setup

### Step 1: Create GitHub Repository

1. **Go to GitHub**:
   - Visit [github.com/new](https://github.com/new)
   - Or click "+" in top right → "New repository"

2. **Repository Settings**:
   - **Name**: `affiliate-ad-launch-studio`
   - **Description**: `Professional advertising campaign management platform with AI-powered agents`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with:
     - ❌ README (you already have one)
     - ❌ .gitignore (you already have one)
     - ❌ License (you already have one)
   - Click "Create repository"

3. **Copy the repository URL**:
   - Will be `https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio.git`

### Step 2: Initialize Local Repository

```bash
# Navigate to your project directory
cd /path/to/affiliate-ad-launch-studio

# Initialize Git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Affiliate Ad Launch Studio v1.0.0"

# Rename branch to main (if needed)
git branch -M main

# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio.git

# Push to GitHub
git push -u origin main
```

### Step 3: Verify Upload

1. Refresh your GitHub repository page
2. You should see all files and folders
3. README.md should display automatically

## 📂 Repository Structure on GitHub

Your repository will look like this:

```
affiliate-ad-launch-studio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── components/                  # React components (35+ files)
├── context/                     # Context providers
├── guidelines/                  # Documentation
├── public/                      # Static assets
├── services/                    # API services
├── styles/                      # Global styles
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── App.tsx                     # Root component
├── BUILD_DEPLOYMENT.md         # Build guide
├── CHEAT_SHEET.md             # Quick reference
├── CONFIGURATION_GUIDE.md     # Config guide
├── GEMINI_MIGRATION.md        # API migration guide
├── GITHUB_SETUP.md            # This file
├── LICENSE                     # MIT License
├── main.tsx                    # App entry point
├── package.json               # Dependencies
├── README.md                  # Main documentation
├── START_HERE.md              # Getting started
├── tsconfig.json              # TypeScript config
├── VERCEL_DEPLOYMENT.md       # Vercel guide
├── vercel.json                # Vercel config
├── vite.config.ts             # Vite config
├── WORKER_SETUP.md            # Worker guide
└── worker-example.js          # Worker code example
```

## 🔒 Secrets Management

### GitHub Secrets for CI/CD

If using GitHub Actions for deployment:

1. **Go to Repository Settings**:
   - Click "Settings" tab
   - Scroll to "Security" section
   - Click "Secrets and variables" → "Actions"

2. **Add Repository Secrets**:
   - Click "New repository secret"
   - Add each secret:

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VITE_AGENT_WORKER` | Cloudflare Worker URL | Deploy worker, copy URL |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Google Cloud Console |
| `VERCEL_TOKEN` | Vercel deployment token | Vercel Account Settings |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel project settings |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel project settings |

3. **Get Vercel Secrets**:
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Get project info (shows ORG_ID and PROJECT_ID)
cat .vercel/project.json

# Get token from: https://vercel.com/account/tokens
```

## 🔀 Branching Strategy

### Recommended Workflow

```bash
# Main branch (production)
main/master

# Development branch
develop

# Feature branches
feature/agent-improvements
feature/new-analytics
feature/ui-updates

# Bugfix branches
bugfix/authentication-issue
bugfix/worker-timeout

# Hotfix branches
hotfix/critical-security-patch
```

### Creating Branches

```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Make changes
git add .
git commit -m "Add: Your feature description"

# Push to GitHub
git push origin feature/your-feature-name
```

### Creating Pull Requests

1. Push your branch to GitHub
2. Go to repository on GitHub
3. Click "Compare & pull request"
4. Add description
5. Request reviewers (if team project)
6. Click "Create pull request"

## 📝 Commit Message Guidelines

Use conventional commit format:

```bash
# Features
git commit -m "feat: Add video script generation to Video Director agent"

# Bug fixes
git commit -m "fix: Resolve authentication redirect loop"

# Documentation
git commit -m "docs: Update worker setup instructions"

# Style changes
git commit -m "style: Improve mobile responsive design"

# Refactoring
git commit -m "refactor: Optimize agent chat panel performance"

# Tests
git commit -m "test: Add unit tests for campaign context"

# Chores
git commit -m "chore: Update dependencies to latest versions"
```

## 🏷️ Tagging Releases

### Create Version Tags

```bash
# Tag current commit
git tag -a v1.0.0 -m "Release version 1.0.0 - Initial production release"

# Push tags to GitHub
git push origin --tags
```

### Create GitHub Release

1. Go to repository → "Releases"
2. Click "Create a new release"
3. Choose tag or create new: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. Description:
   ```markdown
   ## 🚀 Features
   - 11 specialized AI agents
   - Google authentication
   - Cloudflare Worker integration
   - Google Gemini API support
   - Weekly reports functionality
   
   ## 📦 Installation
   See README.md for installation instructions.
   ```
6. Click "Publish release"

## 👥 Collaboration

### Adding Collaborators

1. **Go to Settings → Collaborators**
2. Click "Add people"
3. Enter GitHub username or email
4. Choose permission level:
   - **Read**: View code only
   - **Write**: Push to repository
   - **Admin**: Full access

### Setting Up Branch Protection

1. **Go to Settings → Branches**
2. Click "Add rule"
3. Branch name pattern: `main`
4. Enable:
   - ✅ Require pull request before merging
   - ✅ Require approvals (1+)
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
5. Click "Create"

## 🤖 GitHub Actions

### Included Workflow

The repository includes `.github/workflows/deploy.yml`:

**Triggers**:
- Push to `main` → Deploy to production
- Push to any branch → Build and test
- Pull request → Build and test

**Jobs**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Type check
5. Build application
6. Deploy to Vercel (main branch only)

### Monitoring Workflows

1. Go to "Actions" tab
2. View workflow runs
3. Click on a run to see details
4. Check logs for errors

### Manually Trigger Workflow

1. Go to "Actions" tab
2. Select workflow
3. Click "Run workflow"
4. Choose branch
5. Click "Run workflow" button

## 📊 Repository Insights

### Viewing Statistics

- **Traffic**: See visitors and clones
- **Insights**: View commits, contributors, traffic
- **Network**: Visualize branch history
- **Pulse**: See recent activity

### Enable Discussions (Optional)

1. Go to Settings → General
2. Scroll to "Features"
3. Enable "Discussions"
4. Use for Q&A, ideas, announcements

## 🔍 Search and Code Navigation

### GitHub Code Search

```
# Search in your repository
filename:workerService.tsx

# Search for function
function AgentChatPanel

# Search in specific directory
path:components/agents/ GoogleAuth

# Search for TODO comments
TODO language:typescript
```

### Code Navigation

- Click on function names to see definitions
- Use "Go to file" (press `t` on repository page)
- Use "Find in files" (press `/` then search)

## 🛡️ Security

### Security Advisories

1. Go to Security tab
2. Enable security advisories
3. Configure Dependabot:
   ```yaml
   # .github/dependabot.yml
   version: 2
   updates:
     - package-ecosystem: "npm"
       directory: "/"
       schedule:
         interval: "weekly"
   ```

### Security Scanning

GitHub automatically:
- Scans for known vulnerabilities
- Alerts on security issues
- Suggests dependency updates

### Environment File Security

✅ **Good**: `.env` is in `.gitignore`
✅ **Good**: `.env.example` has no real credentials
❌ **Bad**: Never commit `.env` with real credentials

## 📋 Issue Templates

### Create Issue Template

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- Browser: [e.g. Chrome 120]
- Device: [e.g. Desktop, iPhone 12]
- Version: [e.g. v1.0.0]
```

## 🎨 Repository Settings

### Recommended Settings

**General**:
- ✅ Issues enabled
- ✅ Projects enabled (for project management)
- ✅ Wiki disabled (use docs folder instead)
- ✅ Allow squash merging
- ✅ Automatically delete head branches

**Branches**:
- Default branch: `main`
- Branch protection: Enable for `main`

**Pages** (Optional):
- Can deploy documentation to GitHub Pages

## 📦 GitHub Packages (Optional)

Publish as npm package:

```json
// package.json
{
  "name": "@yourusername/affiliate-ad-launch-studio",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

## 🔗 Useful Links

### Your Repository URLs

Replace `YOUR_USERNAME` with your GitHub username:

- **Repository**: `https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio`
- **Issues**: `https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio/issues`
- **Actions**: `https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio/actions`
- **Settings**: `https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio/settings`

### Badges for README

Add to top of README.md:

```markdown
![Build](https://github.com/YOUR_USERNAME/affiliate-ad-launch-studio/workflows/Deploy%20to%20Vercel/badge.svg)
![License](https://img.shields.io/github/license/YOUR_USERNAME/affiliate-ad-launch-studio)
![Stars](https://img.shields.io/github/stars/YOUR_USERNAME/affiliate-ad-launch-studio)
```

## ✅ Post-Setup Checklist

After setting up GitHub:

- [ ] Repository created
- [ ] Code pushed to main branch
- [ ] README displays correctly
- [ ] .env is not in repository
- [ ] .env.example is committed
- [ ] GitHub Actions workflow added
- [ ] Secrets configured (if using Actions)
- [ ] Branch protection enabled (if team project)
- [ ] Collaborators added (if team project)
- [ ] First release tagged
- [ ] Repository description set
- [ ] Topics/tags added for discoverability

## 🚀 Next Steps

1. **Connect to Vercel**: See `VERCEL_DEPLOYMENT.md`
2. **Set up CI/CD**: Configure GitHub Actions
3. **Add documentation**: Update README with deployment URL
4. **Create first release**: Tag v1.0.0
5. **Share repository**: Add collaborators if needed

---

Need help? Check [GitHub Docs](https://docs.github.com) or open an issue.
