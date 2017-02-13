
// "use strict";

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('./css/[name].css');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
// const PROD = (process.env.NODE_ENV === 'production');

module.exports = {
  entry: ['babel-polyfill', './js/entry.js'],
  output: {
    path: './public/assets',
    filename: 'bundle.js',
    publicPath: '/public/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015'],
          plugins: [
            'transform-object-rest-spread',
            'transform-class-properties',
            'transform-flow-strip-types',
          ],
        },
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', ['css', 'postcss', 'sass']),
      },
      {
        test: /\.css$/,
        loader: 'style!css',
      },
    ],
  },
  postcss: [
    autoprefixer({ browsers: ['last 5 versions'] }),
  ],
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    extractCSS,
  ],
};
