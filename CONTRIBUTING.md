# Contributing to React Paginated MultiSelect

First off, thank you for considering contributing to react-paginated-multiselect! 🎉

It's people like you that make this component better for everyone. We welcome contributions from developers of all skill levels.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Community](#community)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Git
- A GitHub account

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/react-paginated-multiselect.git
cd react-paginated-multiselect
```

3. **Add upstream** remote:

```bash
git remote add upstream https://github.com/Mohamedkamaludeen/react-paginated-multiselect.git
```

## Development Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Build the package:**

```bash
npm run build
```

3. **Watch mode** (auto-rebuild on changes):

```bash
npm run dev
```

4. **Run examples:**

```bash
cd examples
npm install
npm run dev
```

## How to Contribute

### Types of Contributions We're Looking For

- 🐛 **Bug fixes**
- ✨ **New features**
- 📝 **Documentation improvements**
- ♿ **Accessibility improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Tests**
- 🌍 **Translations**

### Making Changes

1. **Create a branch** for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   - Build the package: `npm run build`
   - Test in examples: `cd examples && npm run dev`
   - Ensure no TypeScript errors

4. **Commit your changes:**

```bash
git add .
git commit -m "feat: Add your feature description"
```

Commit message format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

5. **Push to your fork:**

```bash
git push origin feature/your-feature-name
```

6. **Open a Pull Request** on GitHub

## Pull Request Process

1. **Update documentation:**
   - Update README.md if you've changed functionality
   - Update CHANGELOG.md with your changes
   - Add JSDoc comments for new functions/components

2. **Ensure builds pass:**
   - Run `npm run build` without errors
   - No TypeScript errors
   - Code follows the style guide

3. **Write a clear PR description:**
   - What changes were made?
   - Why were these changes needed?
   - How can reviewers test the changes?
   - Link related issues

4. **Request review:**
   - Tag relevant maintainers
   - Be responsive to feedback
   - Make requested changes

5. **After approval:**
   - Maintainer will merge your PR
   - Your changes will be in the next release

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Define proper types (avoid `any`)
- Export types that users might need
- Use generics where appropriate

### Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings
- Add **semicolons**
- Max line length: **90 characters**
- Use **arrow functions** for callbacks
- Use **const** over **let** when possible

### React Best Practices

- Use **functional components**
- Use **hooks** (useState, useEffect, etc.)
- Use **useCallback** for event handlers
- Use **useMemo** for expensive computations
- Avoid unnecessary re-renders

### Naming Conventions

- **Components**: PascalCase (e.g., `PaginatedMultiSelect`)
- **Functions**: camelCase (e.g., `handleLoadPage`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_VISIBLE_ITEMS`)
- **Interfaces**: PascalCase with descriptive names
- **Props interfaces**: ComponentNameProps (e.g., `PaginatedMultiSelectProps`)

### Comments

- Add JSDoc comments for public APIs
- Explain **why**, not **what**
- Keep comments up-to-date
- Remove commented-out code

### Example Code Style

```typescript
/**
 * Loads the next page of options
 * @param params - Pagination parameters
 * @returns Promise with paginated data
 */
const loadNextPage = useCallback(async (params: LoadPageParams) => {
  if (!hasNextPage || isLoadingMore) return;

  setIsLoadingMore(true);
  try {
    await onLoadPage(params);
  } catch (error) {
    console.error('Error loading page:', error);
  } finally {
    setIsLoadingMore(false);
  }
}, [hasNextPage, isLoadingMore, onLoadPage]);
```

## Reporting Bugs

### Before Submitting a Bug Report

- Check existing issues to avoid duplicates
- Try the latest version
- Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Install package
2. Use component with props...
3. See error

**Expected behavior**
What you expected to happen.

**Actual behavior**
What actually happened.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- React version: [e.g., 18.2.0]
- Package version: [e.g., 1.0.0]

**Additional context**
Any other relevant information.
```

## Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Mockups, examples, or use cases.

**Would you be willing to implement this?**
Yes/No
```

## Community

### Get Help

- 📖 [Documentation](README.md)
- 💬 [GitHub Discussions](https://github.com/Mohamedkamaludeen/react-paginated-multiselect/discussions)
- 🐛 [Issue Tracker](https://github.com/Mohamedkamaludeen/react-paginated-multiselect/issues)

### Recognition

Contributors will be:
- Listed in release notes
- Mentioned in CHANGELOG.md
- Added to package.json contributors field (for significant contributions)

## Development Tips

### Testing Changes

Test your changes with the examples:

```bash
# Terminal 1: Watch mode for package
npm run dev

# Terminal 2: Run examples
cd examples
npm run dev
```

### Keeping Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream/master into your local master
git checkout master
git merge upstream/master

# Push to your fork
git push origin master
```

### Common Issues

**TypeScript errors after changes:**
```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P > "TypeScript: Restart TS Server"
```

**Build issues:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue with your question, or reach out to the maintainers.

---

**Thank you for making react-paginated-multiselect better! 🚀**
