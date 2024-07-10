const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        css: './src/css.js',
        vendor: './src/vendor.js',
        bundle: './src/main.jsx'
    },
    mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
    devtool: process.env.WEBPACK_SERVE ? 'source-map' : false,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/dist/',
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(js|jsx)$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    }
};
