

let path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'assets',
  lintOnSave: true,
  runtimeCompiler: true,
  chainWebpack: config => {
    config.resolve.symlinks(true),
    config.module
      .rule('vue')
      .test(/\.vue$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
  },
  configureWebpack: config => ({
    optimization: {
      splitChunks: {
        chunks: "async",
        minSize: 30000,
        minChunks: 2,
        maxAsyncRequests: 5,
        maxInitialRequests: 3
      }
    },
  }),
  // 生产环境是否生成 sourcemap 文件
  productionSourceMap: false,
  // CSS 相关配置
  css: {
    // extract: true,
    sourceMap: false,
    modules: false,
    loaderOptions: {
     
  }
  },
  devServer: {
    disableHostCheck: true,
    open: process.platform === 'darwin',
    host: '127.0.0.1',
    port: 8080,
    https: false,
    overlay: {
      warnings: true,
      errors: true
    },
    before: app => {}
  }
}