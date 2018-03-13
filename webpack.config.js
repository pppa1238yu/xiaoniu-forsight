// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
module.exports = {
	entry: {
        main: [
            'whatwg-fetch',
            'webpack/hot/only-dev-server',
            './src/app/App.tsx'
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
    devServer: {
        contentBase: 'src/www',
        hot: true,
        inline: true,
        port: 8080,
        host: 'localhost',
    },
	devtool: 'source-map',
	output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
	resolve: {
		extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
	},
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new TransferWebpackPlugin([ 
                {from: 'www'},
        ], path.resolve(__dirname, 'src')),
    ],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
			}
		]
	},

};
