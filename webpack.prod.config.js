'use strict';

module.exports = {
  mode: 'production',
  entry: './mgl/index.ts',
  output: {
    path: `${__dirname}/build`,
    filename: 'mgl.js',
    library: 'mgl',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  }
};