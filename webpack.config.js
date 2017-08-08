var path = require('path');
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');

var DEV =  process.env.NODE_ENV === 'dev';

var plugins = DEV ? 
  [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
      inject: true,
      chunks: ['index']
    })
  ] :
  [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true,
        drop_console: true
      }
    })
  ];

module.exports = {
  devtool: 'source-map',
  entry: {
    index: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname),
    filename: DEV ? '[name].js' : 'validate-js.min.js',
    publicPath:'/',
    libraryTarget: 'umd',
    // library: 'validate'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins: plugins
}
