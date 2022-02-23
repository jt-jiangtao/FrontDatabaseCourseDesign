module.exports = {

    devServer: {
        proxy: {
            '/api': {
                target: 'https://api.jiangtao.website/',// 后端接口
                changeOrigin: true, // 是否跨域
                pathRewrite: {
                    '/api': ''
                }
            }
        }
    }
}
