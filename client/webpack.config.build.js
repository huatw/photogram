'use strict'
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  output: {
    filename: 'js/bundle.[hash].min.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  devtool: 'source-map',

  module: {
    rules: [
      {test: /\.jsx?$/, use: ['babel-loader'], exclude: /node_modules/},
      {test: /\.css$/, use: ExtractTextPlugin.extract({use: 'css-loader?minimize=true'})},
      {test: /\.(png|jpg|gif)$/, use: ['url-loader?name=img/[hash].[ext]&limit=8192']},
      {test: /\.(eot|svg|ttf|woff)/, loader: ['file-loader?name=font/[hash].[ext]']}
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index-template.html',
      filename: './index.html',
      minify: {
        removeComments: true
      }
    }),
    new ExtractTextPlugin('css/style.[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'PROD')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false // remove all comments
      },
      compress: {
        warnings: false // no error message in production
      }
    })
  ],

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM',
    'react-redux': 'ReactRedux',
    'redux': 'Redux',
    'prop-types': 'PropTypes',
    'rx': 'Rx'
  }
}