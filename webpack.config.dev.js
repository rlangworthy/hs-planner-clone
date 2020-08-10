const path = require('path');
const webpack = require('webpack');

const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const config = {
  entry: {
    "app": path.resolve(__dirname, "src", "index.tsx"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: "source-map",
  watch: true,
  watchOptions: {
    poll: true
  },
  resolve: {
    extensions: [".webpack.js", ".ts", ".tsx", ".spec.ts", ".spec.tsx", ".js", ".json"],
    plugins: [
      new TsConfigPathsPlugin(path.resolve(__dirname, "tsconfig.js")),
    ],
  },
  module: {
    rules: [
      // images
      { test: /\.png$|\.jpg$|\.gif$|\.svg$/, use: "file-loader" },
      // fonts
      { test: /\.ttf$|\.eot$|\.woff2?$/, use: 'file-loader'},
      // typescript
      { test: /\.tsx?$|\.spec\.tsx?$/, use: "awesome-typescript-loader" },
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
