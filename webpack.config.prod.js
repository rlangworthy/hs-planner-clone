const path = require('path');
const webpack = require('webpack');

const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
  entry: {
    "app": path.resolve(__dirname, "src", "index.tsx"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: 'source-map',
  resolve: {
    extensions: [".webpack.js", ".ts", ".tsx", ".js", ".json"],
    plugins: [
      new TsConfigPathsPlugin(path.resolve(__dirname, "tsconfig.js")),
      //new UglifyJsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      })
    ],
  },
  module: {
    rules: [
      // images
      { test: /\.png$|\.jpg$|\.gif$|\.svg$/, use: "file-loader" },
      // fonts
      { test: /\.ttf$|\.eot$|\.woff2?$/, use: 'file-loader'},
      // typescript
      { test: /\.tsx?$/, 
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "awesome-typescript-loader",
          },
      ]},
      // scss
      { test: /\.scss?$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [
                  require("postcss-smart-import"),
                  require("precss"),
                  require("autoprefixer")
                ];
              }
            }
          },
          { loader: "sass-loader" }
        ]
      },
      // css
      { test: /\.css?$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [
                  require("postcss-smart-import"),
                  require("precss"),
                  require("autoprefixer")
                ];
              }
            }
          }
        ]
      }
    ]
  }
}

module.exports = config;
