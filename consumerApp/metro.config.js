const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Root cause: Metro uses the `"import"` condition from package.json `exports`
// when the importing file is an ES module (`isESMImport === true`). For zustand
// and similar packages, this resolves to `.mjs` files containing
// `import.meta.env` — syntax that is invalid when Metro bundles for web as a
// script (not an ES module), causing:
//   "Uncaught SyntaxError: Cannot use 'import.meta' outside a module"
//
// Fix: intercept resolution on the web platform and resolve again with
// `isESMImport: false` so the package `exports` map picks the `"require"`
// condition (CJS build) instead of the `"import"` condition (ESM/.mjs build).
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && context.isESMImport) {
    try {
      return context.resolveRequest(
        { ...context, isESMImport: false },
        moduleName,
        platform,
      );
    } catch (_) {
      // fall through to default resolution
    }
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Add 'web' to platforms for correct .web.ts / .web.tsx file resolution.
config.resolver.platforms = ['ios', 'android', 'web'];

module.exports = config;
