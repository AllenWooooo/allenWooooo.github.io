import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import minimist from 'minimist';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';

const dependencies = Object.keys(JSON.parse(fs.readFileSync('package.json')).dependencies);
if (dependencies.indexOf('normalize.css') !== -1) {
  let index = dependencies.indexOf('normalize.css');
  dependencies.splice(index, 1);
}
let app = path.join(__dirname + '/src');
let MODE = minimist(process.argv.slice(2)).MODE;
let config = {
  context: app,
  entry: {
    app: './app/app.jsx',
    vendors: dependencies
  },
  output: {
    path: path.resolve(__dirname, './static/assets/'),
    filename: 'app.js'
  },
  module: {
    preLoaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }],
    loaders: [{
      test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/,
      loader: 'file?name=fonts/[name].[ext]'
    }, {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.less$/,
      exclude: /node_modules/,
      loader: ExtractTextPlugin.extract('style', 'css!postcss!less', {
        publicPath: '../'
      })
    }]
  },
  postcss() {
    return [autoprefixer];
  },
  resolve: {
    root: app,
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new ExtractTextPlugin('style/app.css'),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(MODE)
      }
    })
  ]
}

if (MODE === 'production') {
  let plugins = [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.DedupePlugin()
  ];

  config.plugins.push(...plugins);
} else {
  config.plugins.devtool = 'eval';
}

export default config;