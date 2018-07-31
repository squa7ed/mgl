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
