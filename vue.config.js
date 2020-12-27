const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = '记忆之声'
const port = 4000

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  lintOnSave: true,
  productionSourceMap: false,
  outputDir: 'dist',
  assetsDir: 'static',

  devServer: {
    open: process.platform === 'darwin',
    host: 'localhost',
    port: port,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        // "http://47.92.115.105:8088","http://192.168.31.48:8080"
        target: 'http://www.jiyilive.com',
       // target: 'http://47.92.115.105:8088',
      //  target: 'http://localhost:8084',
    //  target: 'http://192.168.31.47:8084',
        changeOrigin: false,
        ws: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    before: app => {}
  },

  configureWebpack: {
    name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@src': resolve('src'),
        '@components': resolve('src/components'),
        '@views': resolve('src/views'),
        '@api': resolve('src/api'),
        '@utils': resolve('src/utils'),
        '@router': resolve('src/router')
      }
    }
  },

  chainWebpack(config){
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        resolve('src/styles/variables.scss')
      ]
    }
  }
}
