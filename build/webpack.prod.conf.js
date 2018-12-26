const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    output: {
        filename: "js/[name].[chunkhash:16].js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
            inject: 'body',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
        }),
        new CleanWebpackPlugin(['../dist'], { allowExternal: true }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css',
            chunkFilename: 'css/[id].[hash].css',
        }),

    ],
    optimization: {
        splitChunks: {
            chunks: "all",
            minChunks: 1,
            minSize: 0,
            cacheGroups: {
                framework: {
                    test: "framework",
                    name: "framework",
                    enforce: true
                },
                vendor: {
                    priority: 10,
                    test: /node_modules/,
                    name: "vendor",
                    enforce: true,
                    reuseExistingChunk: true
                }
            }
        },
        minimizer: [
            new UglifyJSPlugin(),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: true
                    ? {
                        map: { inline: false }
                    }
                    : {}
            })
        ],
    },
    module: {
        rules:
            [
                {
                    test: /\.(css)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                // modules: true,
                                localIdentName: '[local]__[hash:7]'
                            }
                        }
                    ]
                },
                {
                    test: /\.(scss)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
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
                    include: [/antd/],
                }
            ]
    },

});

