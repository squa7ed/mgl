'use strict';

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: `${__dirname}/build`,
    publicPath: `${__dirname}/build`,
    filename: '[name].js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: `${__dirname}`,
    watchContentBase: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }]
  }
};