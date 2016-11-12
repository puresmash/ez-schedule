
// "use strict";

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('./css/[name].css');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: ['babel-polyfill', './js/entry.js'],
    output:{
        path: "./public/assets",
        filename: "bundle.js",
        publicPath: '/public/'
    },
    module: {
        loaders: [
            {
              test: /\.jsx?$/,
              exclude: /(node_modules|bower_components)/,
              loader: 'babel',
              query: {
                presets: ['react', 'es2015'],
                plugins: ['transform-class-properties']
              }
            },
            {
              test: /\.scss$/,
              loader: ExtractTextPlugin.extract('style', ['css', 'postcss', 'sass'])
            },
            {
              test: /\.css$/,
              loader: "style!css"
            }
        ]
    },
    postcss: [
            autoprefixer({browsers: ['last 5 versions']})
    ],
    plugins: [
        extractCSS
    ]
};
