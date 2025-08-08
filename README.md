# BPM Tap

[![CI/CD](https://github.com/username/bpm-tap/workflows/CI%2FCD/badge.svg)](https://github.com/username/bpm-tap/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-site-id/deploy-status)](https://app.netlify.com/sites/your-site/deploys)

A lightweight, performant web app for tapping out the tempo of songs. Designed as a Progressive Web App (PWA) optimized for mobile devices.

## ✨ Features

- **Simple Tap Interface**: Large tap area for easy use
- **Real-time BPM Display**: Shows tempo as you tap
- **Lock Last BPM**: Save and display previous tempo readings
- **Progressive Web App**: Install on mobile devices for app-like experience
- **Responsive Design**: Works on desktop and mobile
- **Lightweight**: Minimal bundle size for fast loading
- **Offline Support**: Works without internet connection

## 🚀 Live Demo

Visit the live app: [https://bpm-tap-0.netlify.app/](https://bpm-tap-0.netlify.app/)

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/username/bpm-tap.git
cd bpm-tap

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 📱 PWA Installation

### Mobile (iOS/Android)
1. Visit the app in your mobile browser
2. Look for "Add to Home Screen" or "Install App" prompt
3. Follow the prompts to install

### Desktop
1. Visit the app in Chrome/Edge
2. Look for the install icon in the address bar
3. Click to install as a desktop app

## 🔄 Automated Releases

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and releases.

### Commit Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New features → minor version bump
- `fix`: Bug fixes → patch version bump  
- `feat!` or `BREAKING CHANGE:`: Breaking changes → major version bump
- `docs`, `style`, `refactor`, `perf`, `test`, `chore`: No version bump

**Examples:**
```bash
feat: add haptic feedback for mobile devices
fix: correct BPM calculation for rapid tapping
docs: update installation instructions
perf: optimize color interpolation algorithm
feat!: redesign tap interface
```

### Release Process

1. Push commits to `main` branch using conventional format
2. GitHub Actions automatically:
   - Runs tests and builds the app
   - Determines next version based on commits
   - Creates a GitHub release with changelog
   - Deploys to Netlify

## 🚀 Deployment

The app automatically deploys to Netlify when changes are pushed to the `main` branch.

### Manual Deployment

```bash
# Build the app
npm run build

# Deploy dist/ folder to your hosting provider
```

### Environment Variables (for CI/CD)

Set these secrets in your GitHub repository:

- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
- `NETLIFY_SITE_ID`: Your Netlify site ID
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## 🏗️ Technology Stack

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: SCSS
- **PWA**: Vite PWA Plugin
- **Color Interpolation**: d3-interpolate
- **CI/CD**: GitHub Actions + semantic-release
- **Hosting**: Netlify

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:

- Development setup
- Code style guidelines  
- Commit message format
- Pull request process

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎵 About

Created for musicians, producers, and anyone who needs to quickly determine the tempo of music. The app prioritizes simplicity, performance, and mobile-first design.
