import { defineConfig } from 'vite';
import { dependencies } from './package.json';
import { builtinModules } from 'node:module';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      entryRoot: './src',
      tsconfigPath: './tsconfig.build.json',
    }),
  ],
  build: {
    target: 'node22',
    minify: true,
    sourcemap: true,

    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
      external: [
        ...builtinModules,
        /^node:/,
        ...Object.keys(dependencies),
        /^prettier/,
      ],
    },
  },
});
