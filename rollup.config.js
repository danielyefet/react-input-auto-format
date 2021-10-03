import { babel } from '@rollup/plugin-babel';
import packageJSON from './package.json';

export default {
  input: 'src/index.js',
  output: [
    {
      file: packageJSON.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
  ],
  plugins: [babel({ babelHelpers: 'bundled' })],
  external: ['react', 'react-dom'],
};
