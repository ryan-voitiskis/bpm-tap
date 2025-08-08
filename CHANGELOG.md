# Changelog

All notable changes to this project will be documented in this file.

# 1.0.0 (2025-08-08)


### Bug Fixes

* **build:** resolve vite-plugin-pwa compatibility and workflow issues ([d7fb46b](https://github.com/ryan-voitiskis/bpm-tap/commit/d7fb46b0ba4825a1b0d6b86ac8097884023c5d66))
* **ci:** add write permissions for semantic-release ([5500f36](https://github.com/ryan-voitiskis/bpm-tap/commit/5500f36e3f873e7093d6dcc4e383d0eace09fc5a))
* PWA issues in lighthouse ([cf30108](https://github.com/ryan-voitiskis/bpm-tap/commit/cf30108b3c8908da2b8216d71c13df8d13537c97))


### Features

* #tap_button active styling ([556861a](https://github.com/ryan-voitiskis/bpm-tap/commit/556861a66a33a8c5bf6d4ea3718b9ddd388a5766))
* setup semantic-release with automated CI/CD ([bf991a5](https://github.com/ryan-voitiskis/bpm-tap/commit/bf991a523edb1b720cae68f8c7cf0af07b817670))


### BREAKING CHANGES

* This commit establishes the foundation for automated releases

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial BPM tap functionality
- Progressive Web App (PWA) support
- Real-time BPM calculation
- Lock/unlock last BPM reading
- Responsive design for mobile and desktop
- Color-coded BPM visualization
- Offline support via service worker
- Automated CI/CD with semantic-release
- ESLint and Prettier configuration
- TypeScript support

### Technical
- Vue 3 with Composition API
- Vite build system
- SCSS styling
- PWA manifest and service worker
- GitHub Actions workflow
- Netlify deployment configuration
