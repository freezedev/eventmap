'use strict';

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['phantomjs-shim', 'mocha', 'chai'],
    files: [
      'dist/eventmap.js',
      'node_modules/chance/chance.js',
      'test/*.js'
    ],
    exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    colors: true,
    autoWatch: false,
    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],
    reporters: ['progress'],
    captureTimeout: 60000,
    singleRun: true
  });
};
