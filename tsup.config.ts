import { defineConfig } from 'tsup';

const commonOptions = {
  entry: ['src/index.ts', 'src/debug.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
};

export default defineConfig((options) => [
  {
    ...commonOptions,
    format: ['esm'],
    outExtension: () => ({ js: '.mjs' }),
    dts: true,
    clean: true,
  },
  {
    ...commonOptions,
    format: 'cjs',
    outDir: './dist/cjs/',
    outExtension: () => ({ js: '.cjs' }),
  },
]);
