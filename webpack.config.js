module.exports = {
  entry: "./index.ts",
  output: {
    filename: "build/bundle.js",
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
};
