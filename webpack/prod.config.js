require('babel-polyfill');

const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(__dirname, '../static/dist');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

module.exports = {
    devtool: 'source-map',
    context: path.resolve(__dirname, '..'),
    entry: {
        'main': [
            './src/client.js',
        ]
    },
    output: {
        path: assetsPath,
        filename: '[name]-[chunkhash].js',
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: '/dist/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }, {
                test: /\.json$/,
                use: ['json-loader']
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize=true&sourceMap', 'postcss-loader']
                })
            }, {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize=true&sourceMap', 'postcss-loader', 'less-loader']
                })
            }, {
                test: /\.json$/,
                exclude: /node_modules/,
                use: ['json-loader']
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?minimize=true&sourceMap', 'postcss-loader', 'sass-loader']
                })
            }, {
                test: /\.ico|\.svg$|\.woff$|\.ttf$|\.eot$/,
                use: ['url-loader?limit=10000&name=fonts/[name].[ext]']
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: "url-loader?limit=10000"
            }, {
                test: webpackIsomorphicToolsPlugin.regular_expression('images'),
                use: 'url-loader?limit=10240'
            }
        ]
    },
    resolve: {
        modules: [
            'src',
            'node_modules'
        ],
        extensions: ['.json', '.js', '.jsx']
    },
    plugins: [
        new CleanPlugin([assetsPath], { root: projectRootPath }),
        new ExtractTextPlugin('[name]-[chunkhash].css', { allChunks: true }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            },
            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: false,
            __DEVTOOLS__: false
        }),
        new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            },
            sourceMap: true
        }),
        webpackIsomorphicToolsPlugin
    ]
};
