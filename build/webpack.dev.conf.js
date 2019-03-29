'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')//获取未被占用的端口
let bundleConfig = require("../bundle-config.json")
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  //不同类型的模块处理规则
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  //source-map
  devtool: config.dev.devtool,//完整的用source-map

  // these devServer options should be customized in /config/index.js
  //开发环境配置项
  devServer: {
    clientLogLevel: 'warning',//当使用内联模式(inline mode)时，在开发工具(DevTools)的控制台(console)将显示消息
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,//启用热更新
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,//一切服务都启用gzip 压缩：
    host: HOST || config.dev.host,//主机
    port: PORT || config.dev.port,//端口号
    open: config.dev.autoOpenBrowser,//自动打开浏览器
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,//公共路径
    proxy: config.dev.proxyTable,//代理配置对象
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    //定义可在业务代码访问的node进程属性
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    //生成html模板
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      // 加载dll文件
      vendorJsName: bundleConfig.vendor.js,
    }),
    // copy custom static assets
    //把文件夹../static内的所有文件从from复制到to
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      },
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {   //获取未被占用的端口
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      //  webpack网页端友好的报错信息就来自它,配置的时候可以加上，有报错提示
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        // 运行成功
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
         //  运行错误
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
