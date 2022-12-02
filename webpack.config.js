const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [path.resolve(__dirname, 'src')],
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devtool: 'eval-source-map',
  output: {
    path: path.resolve(__dirname, 'dist/lib'),
    filename: 'image-lens.js',
    library: 'image-lens',
    libraryTarget: 'umd'
  }
};
