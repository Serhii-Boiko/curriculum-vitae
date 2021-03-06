const path = require('path');
const webpack = require('webpack');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', '..', dir);
}

const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment() {
  const raw = Object.keys(process.env)
      .filter(key => REACT_APP.test(key))
      .reduce(
          (env, key) => {
            env[key] = process.env[key];
            return env;
          },
          {
            NODE_ENV: process.env.NODE_ENV || 'development',
          }
      );

  return {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };
}

require('dotenv').config({path: resolve('.env')});

const env = getClientEnvironment();

module.exports = {
  resolve: {
    alias: {
      '@src': resolve('src'),
      '@public': resolve('public'),
    }
  },
  output: {
    path: resolve('dist'),
    publicPath: '/',
    filename: 'asserts/[name].[hash].js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            emitWarning: true,
          },
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|webp|mp4|ogg|woff|woff2|ttf|eot|ico|otf)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash].[ext]',
          outputPath: 'images/',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      template: resolve('./public/index.html'),
      filename: resolve('./dist/index.html'),
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
    new HtmlWebpackHarddiskPlugin(),
    new SimpleProgressWebpackPlugin({
      format: 'minimal',
    }),
    new webpack.DefinePlugin(env),
  ],
};
