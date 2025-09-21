import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  clean: true,
  dts: true,
  format: ['esm', 'cjs'],
  treeshake: true,
  minify: true,
  sourcemap: false,
  target: 'es2021'
});