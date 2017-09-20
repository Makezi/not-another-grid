var webpack = require('webpack');
var path = require('path');
var glob = require('glob');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var PurifyCSSPlugin = require('purifycss-webpack');
var inProduction = (process.env.NODE_ENV === 'production');

module.exports = {
  entry: {
    main: [
      // './src/js/main.js',
      './src/scss/main.scss'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].min.[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.s[ac]ss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        loaders: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[hash].[ext]'
            }
          },
          'img-loader'
        ]
      },
      {
        test: /\.(svg|eot|ttf|woof|woff2)$/,
        use: 'file-loader'
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      }
    ]
  },
  devServer: {
    stats: 'errors-only',
    compress: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'scss-babel-webpack boilerplate',
      template: 'src/index.html',
      minify: {
        collapseWhitespace: inProduction
      },
      hash: true
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: inProduction
    }),
    new ExtractTextPlugin({
      filename: '[name].min.[chunkhash].css',
      allChunks: true
    }),
    new CleanWebpackPlugin(['dist'], {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html'))
    })
  ]
}

if(inProduction) {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin()
  )
}