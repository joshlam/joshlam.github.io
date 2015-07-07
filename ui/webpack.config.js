var ExtractTextPlugin = require("extract-text-webpack-plugin"),
    path = require('path'),
    webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: {
    index: [
      './app/styles/index.scss',
      './app/scripts/index'
    ]
  },
  output: {
    path: path.join(
      __dirname,
      '..'
    ),
    filename: '[name].js',
    library: 'JoshLam',
    libraryTarget: 'umd',
    sourcePrefix: ''
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
    }),
    new ExtractTextPlugin('[name].css')
  ],
  resolve: {
    root: [
      path.resolve(__dirname, 'app/scripts')
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
        exclude: /node_modules\/(?!eventable\/|z-component\/|z-model\/)/,
        loaders: [
          'babel-loader?' + JSON.stringify({
            optional: ['spec.protoToAssign'],
            plugins: ['object-assign']
          })
        ]
      },
      {
        test: /\.s?css$/,
        exclude: /node_modules\//,
        loader: ExtractTextPlugin.extract('style-loader', [
          'css-loader',
          'autoprefixer-loader?' + JSON.stringify({
            browsers: ['> 1%'],
            cascade: false
          }),
          'sass-loader?' + JSON.stringify({
            includePaths: [
              path.resolve(__dirname, 'app/images')
            ]
          })
        ].join('!'))
      },
      {
        test: /\.(gif|svg)$/,
        exclude: /node_modules/,
        loader: 'url-loader'
      }
    ]
  }
};
