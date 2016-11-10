
// "use strict";

var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('./css/[name].css');

module.exports = {
    entry: ['babel-polyfill', './js/entry.js'],
    output:{
        path: "./public/assets/",
        filename: "bundle.js",
        publicPath: '/static/'
    },
    module: {
        loaders: [
            {
                test: /\.css$/, loader: "style!css"
            },
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
              loader: extractCSS.extract(['css','sass'])
            }
        ]
    },
    plugins: [
        extractCSS
    ]
};
