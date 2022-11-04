const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        use: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  watch: true,
  devtool: 'eval-source-map',
  output: {
    // publicPath: 'test',
    filename: 'cursor-tools.js',
    path: path.resolve(__dirname, 'dist/lib'),
  },
};