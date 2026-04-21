const webpack = require('webpack');
const { merge } = require('webpack-merge');
//const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const compressionWebpackPlugin = require('compression-webpack-plugin');
// const SentryPlugin = require('@sentry/webpack-plugin');
// const path = require('path');

// const PurgecssPlugin = require('purgecss-webpack-plugin');

// const glob = require('glob');
// const PATHS = {
//     src: path.join(__dirname, 'src'),
// };

// 引入js到 html 文件中
//const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const Timestamp = new Date().getTime(); //防止  ios  安卓   缓存
const commonConfig = require('./webpack.config');

let config = merge(commonConfig, {
    mode: 'production',
    plugins: [
        // new CleanWebpackPlugin(),
        // new SentryPlugin({
        //     release: '002',
        //     include: path.resolve(__dirname, '/data/dist'),
        //     urlPrefix: '~/',
        //     ignore: ['node_modules', 'webpack.config.js'],
        // }),
        new MiniCssExtractPlugin({
            filename: `css/[name].[contenthash:8]${Timestamp}.css`,
            chunkFilename: `css/[name].[contenthash:8]${Timestamp}.css`,
            ignoreOrder: true,
        }),
        new compressionWebpackPlugin({
            // filename: '[name].gz[query]',
            algorithm: 'gzip',
            test: /\.(js|css|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
        }),

        new webpack.ids.HashedModuleIdsPlugin(),
        new ProgressBarPlugin({
            format: `  :msg [:bar] ${chalk.green.bold(
                ':percent',
            )} (:elapsed s)`,
        }),
        // new PurgecssPlugin({
        //     paths: glob.sync(`${PATHS.src}/**/*.js`, { nodir: true }),
        // }),
        // new AddAssetHtmlWebpackPlugin({
        //   filepath: path.join(__dirname, '../dist/assets/dll/react.dll.js'),
        // }),
    ],
    performance: {
        maxEntrypointSize: 800000,
        maxAssetSize: 1000000,
    },
    optimization: {
        runtimeChunk: {
            // 为 webpack 运行时代码创建单独的chunk
            name: 'manifest',
        },
        splitChunks: {
            // include all types of chunks
            chunks: 'all',
            // 重复打包问题
            cacheGroups: {
                // styles: {
                //     name: 'styles',
                //     test: /\.(s?css|less|sass)$/,
                //     chunks: 'all',
                //     enforce: true,
                //     priority: 10,
                // },

                vendors: {
                    // node_modules里的代码
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: 10, // 优先级
                    enforce: true,
                    minChunks: 2,
                },
                ant: {
                    // node_modules里的代码
                    test: /[\\/]node_modules[\\/]_?antd-mobile(.*)/,
                    chunks: 'all',
                    priority: 10, // 优先级
                    enforce: true,
                    minChunks: 1,
                },
                reactdom: {
                    // node_modules里的代码
                    test: /[\\/]node_modules[\\/]_?react-dom(.*)/,
                    chunks: 'all',
                    priority: 10, // 优先级
                    enforce: true,
                    minChunks: 1,
                },
                react: {
                    // node_modules里的代码
                    test: /[\\/]node_modules[\\/]_?react(.*)/,
                    chunks: 'all',
                    priority: 10, // 优先级
                    enforce: true,
                    minChunks: 1,
                },
            },
        },
        minimize: true, // 开启最小化
        minimizer: [
            new TerserPlugin({
                // terserOptions: {
                //     compress: {
                //         pure_funcs: ['console.log'],
                //     },
                // },
            }),
        ],
    },
    // devtool: 'source-map',
    devtool: false,
});

if (process.env.npm_lifecycle_event === 'build:watch') {
    config = merge(config, {
        devtool: 'cheap-source-map',
    });
}
if (process.env.npm_lifecycle_event === 'build:report') {
    const BundleAnalyzerPlugin = WebpackBundleAnalyzer.BundleAnalyzerPlugin;
    config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
