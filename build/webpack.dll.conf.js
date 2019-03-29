// 拆分 bundles，同时提升构建速度
// https://doc.webpack-china.org/plugins/dll-plugin/
// https://segmentfault.com/a/1190000010045690
// http://engineering.invisionapp.com/post/optimizing-webpack/
const path = require('path')
const webpack = require('webpack')
const config = require('../config')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const AssetsPlugin = require('assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin'); //清除之前生成的文件
//读取package.json里的依赖，normalize.css除外，打包会报错
const package = require('../package.json')
let dependencies = Object.keys(package.dependencies) || []
//如果使用了chrome的vue-devtool，那打包的时候把vue也排除掉，因为压缩过的vue是不能使用vue-devtool的
//dependencies =dependencies.length > 0 ? dependencies.filter(item => item !== 'vue') : []
let pathsToClean = [path.join(__dirname, '../static/lib')];//要清除的路径
let cleanOptions = {//清除文件的配置
  root:  path.join(__dirname, '../'),//项目的根目录
  exclude: [],//剔除的文件
  verbose: true,//是否写日志到console.log里
  dry: false
};
module.exports = {
  entry: {
    vendor: dependencies
  },
  output: {
    path: path.join(__dirname, '../static/lib'),
    filename: 'dll.[name]_[hash:6].js',
    library: '[name]_[hash:6]'
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),//先清空之前的目录  
    new webpack.DllPlugin({
      path: path.join(__dirname, '../', '[name]-manifest.json'),// 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
      name: '[name]_[hash:6]'
    }),
    // 把带hash的dll插入到html中
    new AssetsPlugin({
      filename: 'bundle-config.json',
      path: './'
    }),
    //压缩混淆
    new UglifyJsPlugin({
        uglifyOptions: {
            compress: {
            warnings: false,
            drop_debugger: true,//去掉debugger
            drop_console: true//去掉console.log
            }
        },
        sourceMap: config.build.productionSourceMap,
        parallel: true
        }),
  ]
}