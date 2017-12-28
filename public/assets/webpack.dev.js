const webpack = require('webpack');
const path = require('path');
const ROOT_PATH = path.resolve(__dirname);
const APP_PATH = path.resolve(ROOT_PATH, 'assets/src/main/main.js');
const BUILD_PATH = path.resolve(ROOT_PATH, 'assets/public/dist');
var AssetsPlugin = require('assets-webpack-plugin');
var assetsPluginInstance = new AssetsPlugin();
module.exports = {
    devtool: 'eval-source-map',
    entry: APP_PATH, // 入口文件
    output: {
        path: BUILD_PATH,
        filename: "dist.js"
    },
    module: {
        rules: [
            {
                test: /\.json$/,
                use: 'json-loader' },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader'] },
            {
                test: /\.(css|scss)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'] },
            {
                test: /\.less$/,
                use: 'less-loader'
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|jpg|gif|jpeg)$/,
                use: 'url-loader',
            },
        ] },
    resolve: {
        extensions: ['.jsx', '.js'],
        alias: {
            public: path.resolve(ROOT_PATH, 'assets/public'),
            lib: path.resolve(ROOT_PATH, 'assets/src/lib'),
            publicComponent: path.resolve(ROOT_PATH, 'assets/src/publicComponent')
        },
    },
    plugins: [assetsPluginInstance],
    devServer: {
        contentBase: './assets/public/dist',
        port: 7070,
        host: 'localhost',
        historyApiFallback: true, // 不跳转 ，在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        inline: true, // 实时刷新
    }
};