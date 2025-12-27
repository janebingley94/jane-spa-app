import path from "node:path";
import { fileURLToPath } from "node:url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import CopyWebpackPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.[contenthash].js",
    publicPath: "/",
    clean: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/_redirects",
          to: "_redirects",
          toType: "file"
        }
      ]
    }),
    new webpack.DefinePlugin({
      "process.env.WORKER_URL": JSON.stringify(
        process.env.WORKER_URL || "https://api.janebingley.cc/chat"
      )
    })
  ],
  devServer: {
    historyApiFallback: true,
    port: 3000,
    open: true
  }
};
