'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge') // 合并方法
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')// css提取插件
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin') // 清除之前生成的文件
let bundleConfig = require('../bundle-config.json')
let pathsToClean = [path.join(__dirname, '../dist')]// 要清除的路径
let cleanOptions = {// 清除文件的配置
  root: path.join(__dirname, '../'), // 项目的根目录
  exclude: [], // 剔除的文件
  verbose: true, // 是否写日志到console.log里
  dry: false
}
const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true, // 这个函数这个参数配置了cssloader
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false, // '#source-map'
  output: {// 输出的配置
    path: config.build.assetsRoot, // 输出的路径
    filename: utils.assetsPath('js/[name].[chunkhash].js'), // 输出的entry chunk的命名
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js') // 不再主入口块，但是也需要打包的块的命名（懒加载的块）
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions), // 先清空之前的目录
    // http://vuejs.github.io/vue-loader/en/workflow/production.html

    // 配置在业务代码里面可以使用的环境变量，
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 压缩混淆
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_debugger: true, // 去掉debugger
          drop_console: true// 去掉console.log
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    // extract css into its own file

    // 把CSS提取到单独的文件
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin

    // 生成html文件
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index, // 输出的文件
      template: 'index.html', // 本地模板文件的位置
      inject: true,
      // 加载dll文件
      vendorJsName: bundleConfig.vendor.js,
      minify: {// 缩小html的选项
        removeComments: true, // 删除注释
        collapseWhitespace: true, // 折叠空格
        removeAttributeQuotes: true/// / 删除各种html标签属性值的双引号
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    // 提取库文件，从node_modules里面抽取,entry没有vendor 块，会创建名为vendor的块，minChunks是函数，返回的是布尔值，只有符合条件的才会提取出来
    // webpack性能优化：项目比较大的情况下这里不会用这个插件提取公共库，而是结合DllPlugin插件打包出一个不经常更改的库文件
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks (module) {
    //     // any required modules inside node_modules are extracted to vendor
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       module.resource.indexOf(
    //         path.join(__dirname, '../node_modules')
    //       ) === 0
    //     )
    //   }
    // }),

    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 提取webpack运行时的文件,文件名是manifest，minChunks为无穷大，不会有任何模块打包进来
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    // 扫描app(entry对应的app模块)直接子块里的模块，把出现次数不少于2次的提取出来放到一个叫vendor-async的懒加载模块中，minChunks是数字，只有大于这个数量的引用，才会提取
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 2
    }),

    // copy custom static assets
    // 把文件夹../static内的所有文件从from复制到to
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})
// 是否启用gzip压缩
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}
// 打包报告生成插件，会立即打开浏览器，生成树状态打包日志
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin({
      //  可以是`server`，`static`或`disabled`。
      //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
      //  在“静态”模式下，会生成带有报告的单个HTML文件。
      //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
      analyzerMode: 'static',
      //  路径捆绑，将在`static`模式下生成的报告文件。
      //  相对于捆绑输出目录。
      reportFilename: 'report/report.html',
      //  模块大小默认显示在报告中。
      //  应该是`stat`，`parsed`或者`gzip`中的一个。
      //  有关更多信息，请参见“定义”一节。
      defaultSizes: 'parsed',
      //  在默认浏览器中自动打开报告
      openAnalyzer: true,
      logLevel: 'info' // 日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
    })
  )
}

module.exports = webpackConfig
