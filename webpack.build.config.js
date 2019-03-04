const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Any directories you will be adding code/files into, need to be added to this array so webpack will pick them up
const defaultInclude = path.resolve(__dirname, 'src')

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }],
        include: defaultInclude
      },
      {
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
        include: defaultInclude
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
        include: defaultInclude
      },
      {
        test: /\.(ttf|eot|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[hash].[ext]'
          }
        }
      },
      {
      test: /\.(woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          name: 'fonts/[hash].[ext]',
          limit: 5000,
          mimetype: 'application/font-woff'
        }
      }
    }
    ]
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'bundle.css',
      chunkFilename: '[id].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new BabiliPlugin()
  ],
  stats: {
    colors: true,
    children: false,
    chunks: false,
    modules: false
  }
}
