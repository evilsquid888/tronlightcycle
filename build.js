const esbuild = require('esbuild');

// Build renderer (browser bundle)
esbuild.build({
  entryPoints: ['src/renderer.ts'],
  bundle: true,
  outfile: 'dist/renderer.js',
  platform: 'browser',
  target: 'es2020',
  sourcemap: true,
}).catch(() => process.exit(1));
