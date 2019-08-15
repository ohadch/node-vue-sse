const path = require('path')
require('dotenv').config()

module.exports = {
    configureWebpack: {
        devServer: {
            proxy: 'http://localhost:3000'
        }
    },
    css: {
        // Enable CSS source maps.
        sourceMap: true
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', path.resolve(__dirname, 'src'));
    }
}
