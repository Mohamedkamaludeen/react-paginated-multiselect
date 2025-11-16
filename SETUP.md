# React Paginated MultiSelect - Setup & Build Instructions

## 📁 Project Structure

```
react-paginated-multiselect/
├── src/
│   ├── components/
│   │   ├── Checkbox.tsx       # Custom checkbox component
│   │   ├── Chip.tsx            # Chip/tag component
│   │   └── Spinner.tsx         # Loading spinner component
│   ├── PaginatedMultiSelect.tsx # Main component
│   ├── types.ts                # TypeScript type definitions
│   ├── styles.css              # Default styles
│   └── index.ts                # Main export file
├── examples/
│   └── App.tsx                 # Example usage
├── dist/                       # Build output (generated)
├── package.json
├── tsconfig.json
├── rollup.config.js
├── README.md
├── QUICKSTART.md
├── CHANGELOG.md
├── CONTRIBUTING.md
└── LICENSE
```

## 🚀 Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- **react & react-dom** (peer dependencies)
- **react-window** (for virtual scrolling)
- **Build tools**: Rollup, TypeScript, Babel, etc.

### 2. Build the Package

```bash
npm run build
```

This creates:
- `dist/index.js` - CommonJS build
- `dist/index.esm.js` - ES Module build
- `dist/index.d.ts` - TypeScript definitions
- `dist/styles.css` - Compiled CSS

### 3. Development Mode

```bash
npm run dev
```

Watches for changes and rebuilds automatically.

## 📦 Publishing to NPM

### First Time Setup

1. Create an NPM account at [npmjs.com](https://www.npmjs.com/)

2. Login to NPM in terminal:
```bash
npm login
```

3. Verify you're logged in:
```bash
npm whoami
```

### Publishing Steps

1. **Build the package**
```bash
npm run build
```

2. **Test the package locally**
```bash
npm pack
```
This creates a `.tgz` file you can test in another project:
```bash
npm install /path/to/react-paginated-multiselect-1.0.0.tgz
```

3. **Publish to NPM**

For first release:
```bash
npm publish
```

For scoped packages (e.g., `@yourname/react-paginated-multiselect`):
```bash
npm publish --access public
```

4. **Update versions**

After making changes:
```bash
# Patch release (1.0.0 -> 1.0.1)
npm version patch

# Minor release (1.0.0 -> 1.1.0)
npm version minor

# Major release (1.0.0 -> 2.0.0)
npm version major
```

Then publish:
```bash
npm publish
```

## 🧪 Testing Locally Before Publishing

### Method 1: npm link

In your package directory:
```bash
npm link
```

In your test project:
```bash
npm link react-paginated-multiselect
```

### Method 2: Direct install

In your test project:
```bash
npm install /path/to/react-paginated-multiselect
```

### Method 3: Pack and install

In your package directory:
```bash
npm pack
```

In your test project:
```bash
npm install /path/to/react-paginated-multiselect-1.0.0.tgz
```

## 🎯 Usage After Publishing

Users will install your package:

```bash
npm install react-paginated-multiselect
```

And use it like this:

```tsx
import { PaginatedMultiSelect } from 'react-paginated-multiselect';
import 'react-paginated-multiselect/dist/styles.css';

function App() {
  return (
    <PaginatedMultiSelect
      multiple
      onLoadPage={handleLoadPage}
      onChange={handleChange}
      // ... other props
    />
  );
}
```

## 📋 Pre-publish Checklist

Before publishing, ensure:

- [ ] ✅ Code builds without errors (`npm run build`)
- [ ] ✅ All TypeScript types are correct
- [ ] ✅ README.md is complete and accurate
- [ ] ✅ Examples work correctly
- [ ] ✅ Version number is correct in package.json
- [ ] ✅ LICENSE file is included
- [ ] ✅ .npmignore or files field in package.json is configured
- [ ] ✅ Repository URL is correct
- [ ] ✅ Keywords are relevant
- [ ] ✅ CHANGELOG.md is updated

## 🔍 What Gets Published

The `files` field in `package.json` specifies what gets published:

```json
"files": [
  "dist",
  "src",
  "README.md"
]
```

This means only these directories and files will be included in the NPM package.

## 🛠️ Troubleshooting

### Build Errors

If you get TypeScript errors:
```bash
npm install --save-dev @types/react @types/react-dom
```

If you get Rollup errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Publishing Errors

**403 Forbidden**: You don't have permission
- Check you're logged in: `npm whoami`
- Package name might be taken - change it in package.json

**402 Payment Required**: Package name is reserved
- Change the package name or use a scope: `@yourname/react-paginated-multiselect`

## 📚 Resources

- [NPM Documentation](https://docs.npmjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Rollup Documentation](https://rollupjs.org/guide/en/)
- [React Documentation](https://react.dev/)

## 🆘 Support

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/Mohamedkamaludeen/react-paginated-multiselect/issues)
2. Create a new issue with details
3. Contact: [Your Email]

---

**Happy Coding! 🚀**
