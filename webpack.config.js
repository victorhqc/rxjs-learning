var path = require('path');
var webpack = require('webpack');

var port = 8000;
var srcPath = path.join(__dirname, '/components');
var publicPath = '/assets/';

module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: 'main.js',
        publicPath: publicPath
    },
    devServer: {
        contentBase: './',
        historyApiFallback: true,
        hot: true,
        port: port,
        publicPath: publicPath,
        noInfo: false
    },
    module: {
        preLoaders: [
            {
                test: /\.(js|jsx)$/,
                include: path.join(__dirname, ''),
                loader: 'eslint-loader'
            }
        ],
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            }
        ]
    },
    resolve: {
        alias: {
            jquery: "jquery/src/jquery"
        },
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};
