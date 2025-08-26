const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './index.ts',
  devtool: 'inline-source-map',
  mode: 'production',
  watch: false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'webpack_app.js',
    path: path.resolve(__dirname, '../../public'),
    libraryTarget: 'var',
    library: 'app'
  },
  optimization: {
    minimize: false
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, '../../.env')
    }),
    new HtmlWebpackPlugin({
      template: "./index.html", // your HTML template
    }),
  ]
};