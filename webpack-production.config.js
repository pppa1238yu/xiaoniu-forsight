const webpack = require('webpack');
const path = require('path');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const config = {
    entry: {
        main: [
            'babel-polyfill',
            'whatwg-fetch',
            './src/app/App.tsx',
        ],
        extra: [
            './src/app/Extra.tsx'
        ],
        smartReport: [
            './src/app/SmartReport.tsx'
        ],
        weChat: [
            './src/app/WeChat.tsx'
        ]
    },
    // output config
    output: {
        path: path.resolve(__dirname, 'build'), // Path of output file
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    plugins: [
        // Define production build to allow React to strip out unnecessary checks
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
        }),
        // Transfer Files
        new TransferWebpackPlugin([
            {from: 'www'},
        ], path.resolve(__dirname, 'src')),
        new WebpackShellPlugin({
            onBuildStart: ['sh modify_host.sh'],
            onBuildEnd: ['rm build/index.html', 'sh modify_version.sh']
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            }
        ]
    },
};

module.exports = config;
