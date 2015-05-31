var path = require('path'),
    webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: {
    index: './app/scripts/index'
  },
  output: {
    path: path.join(
      __dirname,
      '..'
    ),
    filename: '[name].js',
    sourcePrefix: ''
  },
  resolve: {
    root: [
      path.resolve(__dirname, 'app')
    ],
    alias: {
      'z-component': 'z-component/src/z-component.js'
    }
  },
  resolveLoader: {
    modulesDirectories: [ 'lib', 'node_modules' ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!z-component)/,
        loaders: ['babel-loader?' + JSON.stringify({optional: ['spec.protoToAssign']})]
      }
    ]
  }
};
