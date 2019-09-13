module.exports = {
  pluginOptions: {
    autoRouting: {
      chunkNamePrefix: 'page-'
    }
  },
  devServer: {
    proxy: 'http://localhost:1234'
  }
}
