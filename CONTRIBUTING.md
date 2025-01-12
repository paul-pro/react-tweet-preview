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
   bun version patch  # for bug fixes
   bun version minor  # for new features
   bun version major  # for breaking changes
   ```
   This will:
   - Update version in package.json
   - Create a git tag
   - Push changes and tag to GitHub

3. **Automated Release**
   The GitHub Action will automatically:
   - Create a GitHub release
   - Build the package
   - Publish to npm

## NPM Authentication

To publish to npm, you need to:

1. Create an npm account if you don't have one
2. Login to npm:
   ```bash
   npm login
   ```
3. Create an access token:
   - Go to npm website → Settings → Access Tokens
   - Create a new token with publish rights
4. Add the token to GitHub repository:
   - Go to repository Settings → Secrets
   - Add a new secret named `NPM_TOKEN`
   - Paste your npm token as the value

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