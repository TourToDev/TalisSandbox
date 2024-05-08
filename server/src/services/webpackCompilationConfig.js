"use strict";
const helpers = require("../utils/helpers.js");
const isDev = process.env.NODE_ENV === "development";

const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const publicComponentsPath = helpers.root("public", "components");
module.exports = function getWebpackConfig({ componentName }) {
  const componentDirPath = path.resolve(publicComponentsPath, componentName);
  const componentEntryPath = path.resolve(componentDirPath, "src", "_index.js");

  const webpackConfig = {
    entry: {
      polyfill: "@babel/polyfill",
      main: componentEntryPath,
    },
    resolve: {
      extensions: [".js", ".vue"],
      alias: {
        vue$: isDev ? "vue/dist/vue.runtime.js" : "vue/dist/vue.runtime.min.js",
        "@": helpers.root("src"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "assets", // Output directory within 'dist'
                name: "[name].[ext]",
              },
            },
          ],
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                [
                  "import",
                  {
                    libraryName: "ant-design-vue",
                    libraryDirectory: "es",
                    style: "css",
                  },
                ],
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            "vue-style-loader",
            { loader: "css-loader", options: { sourceMap: isDev } },
          ],
        },
        {
          test: /\.less$/,
          use: ["vue-style-loader", "css-loader", "less-loader"],
        },
        {
          test: /\.scss$/,
          use: ["vue-style-loader", "css-loader", "sass-loader"],
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      //new HtmlPlugin({ template: "index.html", chunksSortMode: "dependency" }),
    ],
    output: {
      // path for component js file output
      path: helpers.root("./public", "components", componentName, "dist"),
      // the path used for this component to fetch assets like png and gif
      publicPath: `http://localhost:3000/components/${componentName}/dist/`,
      filename: `js/${componentName}-[hash].js`,
      chunkFilename: `js/${componentName}-[id].[hash].chunk.js`,
    },
  };
  return webpackConfig;
};
