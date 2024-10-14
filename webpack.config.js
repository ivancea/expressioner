import DotenvWebpackPlugin from "dotenv-webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./example/index.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        include: path.resolve(__dirname, "example/styles"),
      },
      {
        test: /\.(jpg|png)$/,
        include: path.resolve(__dirname, "example/assets"),
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    assetModuleFilename: "assets/[hash].[name][ext][query]",
    path: path.resolve(__dirname, "build"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./example/index.html",
    }),
    new MiniCssExtractPlugin(),
    new DotenvWebpackPlugin({
      safe: ".env.defaults",
      defaults: ".env.defaults",
      systemvars: true,
    }),
  ],
};
