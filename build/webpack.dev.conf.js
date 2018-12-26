const path = require('path');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    output: {
        filename: "js/[name].[hash:16].js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: 'body',
            minify: {
                html5: true
            },
            hash: false
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        port: '8080',
        contentBase: path.join(__dirname, '../dist'),
        compress: true,
        historyApiFallback: true,
        hot: true,
        https: false,
        noInfo: true,
        open: true,
        disableHostCheck: true,
        proxy: {}
    },
    module: {
        rules:
            [
                {
                    test: /\.(css)$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                // modules: true,
                                localIdentName: '[local]__[hash:7]'
                            }
                        }
                    ],
                },
                {
                    test: /\.(scss)$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                // modules: true,
                                localIdentName: '[local]__[hash:7]'
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ],

                },
                {
                    test: /\.(gif|jpg|png)\??.*$/,
                    loader: 'url-loader'
                },
            ]
    },
});