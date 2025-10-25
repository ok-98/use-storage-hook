# Publishing Guide

This guide will help you publish your `use-storage-hook` library to npm.

## Prerequisites

1. **npm account**: Create one at https://www.npmjs.com/signup if you don't have one
2. **npm login**: Run `npm login` or `pnpm login` in your terminal

## Before Publishing

### 1. Update package.json

Update the following fields in `package.json`:

```json
{
  "name": "use-storage-hook", // Change if the name is taken
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/use-storage-hook"
  },
  "bugs": {
    "url": "https://github.com/yourusername/use-storage-hook/issues"
  },
  "homepage": "https://github.com/yourusername/use-storage-hook#readme"
}
```

### 2. Check Package Name Availability

```bash
npm search use-storage-hook
```

If the name is taken, choose a unique name like:
- `@yourusername/use-storage-hook` (scoped package)
- `use-web-storage-hook`
- `react-storage-hooks`

### 3. Build the Library

```bash
pnpm run build
```

This will create the `dist/` folder with your compiled library.

### 4. Test Locally (Optional)

You can test your package locally before publishing:

```bash
# In your library directory
pnpm link

# In a test project
pnpm link use-storage-hook
```

## Publishing to npm

### First Time Publishing

```bash
# Login to npm
pnpm login

# Publish
pnpm publish
```

If you're using a scoped package (`@username/package-name`), you need to specify access:

```bash
pnpm publish --access public
```

### Publishing Updates

1. Update the version in `package.json`:
   - Patch: `1.0.0` → `1.0.1` (bug fixes)
   - Minor: `1.0.0` → `1.1.0` (new features, backward compatible)
   - Major: `1.0.0` → `2.0.0` (breaking changes)

2. Or use npm version command:
   ```bash
   npm version patch  # 1.0.0 → 1.0.1
   npm version minor  # 1.0.0 → 1.1.0
   npm version major  # 1.0.0 → 2.0.0
   ```

3. Publish:
   ```bash
   pnpm publish
   ```

## Post-Publishing

### 1. Verify Publication

Visit your package page:
```
https://www.npmjs.com/package/use-storage-hook
```

### 2. Test Installation

```bash
npm install use-storage-hook
# or
pnpm add use-storage-hook
```

### 3. Add Badges to README

Add these badges to your README.md:

```markdown
[![npm version](https://badge.fury.io/js/use-storage-hook.svg)](https://www.npmjs.com/package/use-storage-hook)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## Troubleshooting

### "You do not have permission to publish"

- Make sure you're logged in: `pnpm whoami`
- If using a scoped package, add `--access public`

### "Package name taken"

- Choose a different name or use a scoped package (`@username/package-name`)
- Update the `name` field in `package.json`

### "Cannot publish over existing version"

- Increment the version number in `package.json`

## Best Practices

1. **Always test before publishing**: Run `pnpm run build` and check the `dist/` folder
2. **Use semantic versioning**: Follow semver.org guidelines
3. **Keep your README updated**: Clear documentation helps users
4. **Changelog**: Consider maintaining a CHANGELOG.md file
5. **Git tags**: Tag your releases in git
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

## Automated Publishing with GitHub Actions

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm publish --no-git-checks
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add your npm token to GitHub secrets: Settings → Secrets → Actions → New repository secret
