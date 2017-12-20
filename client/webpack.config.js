'use strict'
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map',

  entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    './src/index.js',
    // the entry point of our app
  ],

  output: {
    filename: 'js/bundle.[hash].js',
    // the output bundle

    path: path.resolve(__dirname, 'dist'),

    publicPath: '/'
    // necessary for HMR to know where to load the hot update chunks
  },

  module: {
    rules: [
      {test: /\.jsx?$/, use: ['babel-loader',], exclude: /node_modules/},
      {test: /\.css$/, use: ['style-loader', 'css-loader?localIndentName=[path][name]-[local]'], exclude: /node_modules/},
      {test: /\.(png|jpg|gif)$/, use: ['url-loader?name=img/[name].[hash].[ext]&limit=8192']},
      {test: /\.(eot|svg|ttf|woff)/, loader: ['file-loader?name=font/[name].[hash].[ext]']}
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index-template.html'
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'DEV')
      }
    }),

    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    new webpack.NamedModulesPlugin(),
    // prints more readable module names in the browser console on HMR updates

    new webpack.NoEmitOnErrorsPlugin(),
    // do not emit compiled assets that include errors

  ],

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM',
    'react-redux': 'ReactRedux',
    'redux': 'Redux',
    'prop-types': 'PropTypes',
    'rx': 'Rx'
  },

  devServer: {
    host: 'localhost',
    port: 8080,

    historyApiFallback: true,
    // respond to 404s with index.html

    hot: true,
    // enable HMR on the server
  }
}