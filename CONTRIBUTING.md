# Contributing to BPM Tap

Thank you for your interest in contributing to BPM Tap! This document provides guidelines and information for contributors.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/bpm-tap.git`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

## Code Style

We use ESLint and Prettier to maintain consistent code style:

- Run linting: `npm run lint`
- Format code: `npm run format`
- Type check: `npm run type-check`

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and changelog generation. Please format your commit messages as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

### Examples

```
feat: add haptic feedback for mobile devices
fix: correct BPM calculation for edge cases
docs: update README with new features
perf: optimize color interpolation function
chore: update dependencies
```

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` in the footer or use `!` after the type:

```
feat!: redesign tap interface
```

## Pull Request Process

1. Create a feature branch: `git checkout -b feat/your-feature-name`
2. Make your changes following the conventional commit format
3. Ensure all tests pass: `npm run build`
4. Push to your fork and create a pull request
5. Fill out the pull request template
6. Wait for review and address any feedback

## Release Process

Releases are automated using semantic-release:

- Commits to `main` trigger automatic releases
- Version numbers are determined by commit types
- Changelog is automatically generated
- Deployment to Netlify happens after successful release

## Performance Guidelines

This app prioritizes performance and minimal bundle size:

- Keep dependencies minimal
- Use Vue's composition API for better tree-shaking
- Optimize for mobile performance
- Consider bundle size impact of new features

## Accessibility

Ensure all contributions maintain accessibility:

- Use semantic HTML
- Provide appropriate ARIA labels
- Support keyboard navigation
- Test with screen readers when possible

## Questions?

Feel free to open an issue for any questions about contributing.