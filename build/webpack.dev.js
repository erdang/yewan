const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const fs = require('fs');

const commonConfig = require('./webpack.config');
const openHttps =
    process.env.HTTPS === 'true'
        ? {
              key: fs.readFileSync(path.join(__dirname, '../ssl/yiayuyin.key')),
              cert: fs.readFileSync(
                  path.join(__dirname, '../ssl/yiayuyin.crt'),
              ),
          }
        : false;

module.exports = merge(commonConfig, {
    mode: 'development',
    // 开发环境本地启动的服务配置
    devServer: {
        port: 4000, // 127.0.0.1  默认是80端口 指定host 可以不要端口
        open: false,
        host: '0.0.0.0',
        historyApiFallback: true,
        allowedHosts: 'all',
        hot: false,
        liveReload: false,
        client: false,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        https: openHttps,

        // devMiddleware: {
        //     writeToDisk: true, //写入硬盘 太卡
        // },
        static: {
            directory: path.join(__dirname, 'assets'),
        },
        compress: true,
        // 接口代理转发
        proxy: {
            // '/api': {
            //     target: '//dev-main.yuewankeji.top/api',
            //     changeOrigin: true,
            //     secure: false,
            //     pathRewrite: { '^/api': '' },
            // },
            '//dev-api.yuewankeji.top/api': {
                target: '//dev-api.yuewankeji.top/api',
                changeOrigin: true,
                pathRewrite: (path) =>
                    path.replace(/^\/\/dev-api.yuewankeji.top\/api\\/, ''),
            },
            '//dev-passport.yuewankeji.top/api': {
                target: '//dev-passport.yuewankeji.top/api',
                changeOrigin: true,
                pathRewrite: (path) =>
                    path.replace(/^\/\/dev-passport.yuewankeji.top\/api\\/, ''),
            },
        },
        // static: {
        //     directory: path.join(__dirname, 'assets'),
        //     publicPath: '/',
        // },
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devtool: 'eval-source-map',
    // optimization: {
    //   moduleIds: 'named',
    // },
});
