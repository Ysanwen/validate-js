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
      output: {
        keep_quoted_props: true
      },
      mangle: {
        screw_ie8: false,
        keep_fnames: true
      },
      compress: {
        screw_ie8: false,
        drop_console: true,
        properties: false
      }
    })
  ];

module.exports = {
  devtool: 'source-map',
  entry: {
    index: ['babel-polyfill', 'raf', './src/index.js']
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
            presets: ['env','es2015']
          }
        }
      }
    ]
  },
  plugins: plugins
}
