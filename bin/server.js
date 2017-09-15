#!/usr/bin/env node
require('../server.babel');
const path = require('path');
const rootDir = path.resolve(__dirname, '..');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

if (__DEVELOPMENT__) {
  if (!require('piping')({ hook: true, ignore: /(\/\.|~$|\.json|\.scss$)/i })) return;
}

console.log('\n', '---- dog environment --->', process.env.NODE_ENV, '\n');

const WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools'))
  .server(rootDir, () => {
    require('../src/server');
  });
