/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

/* eslint-env node */

module.exports = {
  cacheId: 'summit'+require('./package.json').version,
  staticFileGlobs: [
    '/index.html',
    '/manifest.json',
    '/images/**',
    '/bower_components/webcomponentsjs/webcomponents-lite.min.js',
    'https://fonts.gstatic.com/**',
    'https://fonts.googleapis.com/css**',
  ],
  runtimeCaching: [{
   urlPattern: '/data\\/(.*)/',
   handler: 'networkFirst'
  }],
  importScripts:['worker-extension.js'],
  navigateFallback: 'index.html',
};
