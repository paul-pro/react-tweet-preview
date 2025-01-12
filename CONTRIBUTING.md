# Contributing to React Tweet Preview

## Development Process

1. **Setup**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd react-tweet-preview

   # Install dependencies
   bun install

   # Start Storybook for development
   bun run storybook
   ```

2. **Making Changes**
   - Work on a feature branch
   - Follow the code style (Biome)
   - Test your changes in Storybook
   - Commit often with clear messages

3. **Code Quality**
   ```bash
   # Format code
   bun run format

   # Run linter
   bun run lint

   # Build to check for errors
   bun run build
   ```

## Release Process

1. **Preparing for Release**
   - Ensure all changes are committed
   - Make sure CI passes
   - Update documentation if needed

2. **Creating a Release**
   ```bash
   # Update version and create tag
   npm version patch  # for bug fixes
   npm version minor  # for new features
   npm version major  # for breaking changes
   ```
   This will:
   - Run lint and build checks
   - Update version in package.json
   - Create a git tag
   - Push changes and tag to GitHub

3. **Automated Release**
   The GitHub Actions will automatically:
   - Create a GitHub release
   - Build and publish to npm
   - Deploy Storybook documentation
     - Latest version at `/latest`
     - Tagged versions at `/<version>`

## Commit Guidelines

- Use clear, descriptive commit messages
- Prefix commits with type:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `docs:` for documentation
  - `chore:` for maintenance
  - `refactor:` for code changes
  - `test:` for adding tests

Example:
```bash
git commit -m "feat: add support for custom button text"
``` 