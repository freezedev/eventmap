webpack = require('webpack');


module.exports = {
  output: {
    library: 'EventMap',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
    }],
  },
  node: {
    Buffer: false,
  },
}
