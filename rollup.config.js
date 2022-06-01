import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

const output = process.env.BUILD === 'production' ? [
  {
    file: 'dist/validate-js.js',
    format: 'cjs',
    exports: 'default',
  },
  {
    file: 'dist/validate-js.min.js',
    format: 'iife', // amd /  es6 / iife / umd / cjs
    name: 'validate'
  }
]: {
  file: 'dist/validate-js.js',
  format: 'iife', // amd /  es6 / iife / umd / cjs
  name: 'validate',
  sourcemap: true
};

const plugins = process.env.BUILD === 'production' ? [
  resolve(), // resolve all dependencies
  commonjs(), // deal with commonjs modules
  babel({
    exclude: "node_modules/**",
    babelHelpers: 'bundled',
    presets: [
      '@babel/preset-env'
    ]
  }),
  terser() // compress source code
] : [
  resolve(), // resolve all dependencies
  commonjs(), // deal with commonjs modules
  serve({
    host: 'localhost',
    port: 8088
  }),
  livereload({
    delay: 300
  })
];

export default {
  input: 'src/index.js',
  output,
  plugins,
};