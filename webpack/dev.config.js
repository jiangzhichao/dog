require('babel-polyfill');

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const host = (process.env.HOST || 'localhost');
const port = (+process.env.PORT + 1) || 3001;
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin'); // https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));
const babelrc = JSON.parse(fs.readFileSync('./.babelrc'));
babelrc.plugins = [
  ...babelrc.plugins,
  ...babelrc.env.development.plugins
];
delete babelrc.env;
babelrc.plugins.forEach((plugin, index) => {
  if (Array.isArray(plugin) && index > 4) {
    plugin[1].transforms.push({
      transform: 'react-transform-hmr',
      imports: ['react'],
      locals: ['module']
    });
  }
});

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
      'font-awesome-webpack!./src/theme/font-awesome.config.js',
      './src/client.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, '../static/dist'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader?' + JSON.stringify(babelrc), 'eslint-loader']
      }, {
        test: /\.json$/,
        use: ['json-loader']
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      }, {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      }, {
        test: /\.ico|\.svg$|\.woff$|\.ttf$|\.eot$/,
        use: ['url-loader?limit=10000&name=[name].[ext]']
      }, {
        test: /\.json$/,
        exclude: /node_modules/,
        use: ['json-loader']
      }, {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }, {
        test: /\.html$/,
        use: 'html-loader'
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=image/svg+xml"
      }, {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        use: 'url-loader?limit=10240'
      }
    ]
  },
  progress: true,
  resolve: {
    modules: [
      'src',
      'node_modules'
    ],
    extensions: ['.json', '.js', '.jsx']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true
    }),
    webpackIsomorphicToolsPlugin.development()
  ]
};
