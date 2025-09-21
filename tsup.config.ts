import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    highlights: 'src/highlights/index.ts'
  },
  clean: true,
  dts: true,
  format: ['esm'],
  treeshake: true,
  minify: true,
  sourcemap: false,
  target: 'es2021'
});
