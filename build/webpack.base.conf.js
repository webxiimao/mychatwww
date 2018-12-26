const path = require('path');
const APP_PATH = path.resolve(__dirname, '../src');
const DIST_PATH = path.resolve(__dirname, '../dist');
module.exports = {
    entry: {
        app: './src/index.js',
        framework:['react','react-dom']
    },
    output: {
        filename: 'js/bundle.js',
        path: DIST_PATH
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: "babel-loader",
                include: APP_PATH
            }
        ]
    },
    resolve: {
        alias: {
            'pages':path.join(__dirname,'../src/pages'),
            'server':path.join(__dirname,'../src/server'),
            'utils':path.join(__dirname,'../src/utils'),
            'components':path.join(__dirname,'../src/components'),
            'config':path.join(__dirname,'../src/config')
        }
    }
};