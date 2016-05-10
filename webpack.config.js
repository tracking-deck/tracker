var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var paths = {
    dist: path.resolve(__dirname, './dist'),
    tracker : path.resolve(__dirname, './tracker'),
    beamer : path.resolve(__dirname, './beamer'),
    nodemodules: path.resolve(__dirname, 'node_modules')
};

module.exports = {
    entry: {
        tracker: path.resolve(paths.tracker, "app.js"),
        beamer: path.resolve(paths.beamer, "app.js")
    },
    output: {
        path: paths.dist,
        filename: "[name].bundle.js"
    },
    resolve: {
        extensions: ['', '.js'],
        alias: {
            'tracking': path.resolve(paths.nodemodules, 'tracking/build/tracking.js')
        }
    },
    devServer: {
        contentBase: paths.dist,
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: [/node_modules/], loader: 'babel-loader', query: { presets: ['es2015'] } },
            { test: /\.less$/,  loader: 'style!css!less' },
            { test: /\.html$/, loader: 'raw' }
        ]
    },
    plugins: [
            new webpack.ProvidePlugin({
                tracking: "tracking",
                'window.tracking': "tracking"
            }),
            new HtmlWebpackPlugin({
              filename: 'beamer.html',
              template: 'beamer/index.html',
              inject: false
            }),
            new HtmlWebpackPlugin({
              filename: 'tracker.html',
              template: 'tracker/index.html',
              inject: false
            })
        ],
};
