var path = require('path');
var webpack = require('webpack');

var paths = {
    app : path.resolve(__dirname, './src'),
    nodemodules: path.resolve(__dirname, 'node_modules')
};

module.exports = {
    entry: path.resolve(paths.app, "app.js"),
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['', '.js'],
        alias: {
            'tracking': path.resolve(paths.nodemodules, 'tracking/build/tracking.js')
        }
    },
    devServer: {
        contentBase: paths.app,
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
            })
        ],
};
