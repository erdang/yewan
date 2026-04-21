const path = require('path');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
//const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const localIP = (function () {
    var ni = os.networkInterfaces();

    for (var p in ni) {
        var device = ni[p];

        for (var i = 0; i < device.length; i++) {
            if (
                device[i].address.indexOf('10.40') === 0 ||
                device[i].address.indexOf('192.168') === 0
            ) {
                return device[i].address;
            }
        }
    }
})();
console.log(localIP);
const Timestamp = new Date().getTime(); //防止  ios  安卓   缓存
const srcDir = path.join(__dirname, '../src');
const devMode = process.env.NODE_ENV !== 'production';
const openHttps =
    process.env.HTTPS === 'true'
        ? 'https://' + localIP + ':4000/'
        : 'http://' + localIP + ':4000/';

let publicPath = devMode ? openHttps : '/';
let filename = devMode ? `[name].js` : `[name].[chunkhash:8]${Timestamp}.js`;

module.exports = {
    // cache: devMode
    //     ? {
    //           type: 'filesystem', // 使用文件缓存
    //       }
    //     : false,
    entry: {
        main: path.join(__dirname, '../src/main.js'),
    },
    output: {
        crossOriginLoading: 'anonymous',
        path: path.join(__dirname, '../../bulu_h5_dist'),
        filename: 'js/' + filename,
        publicPath: publicPath,
        chunkFilename: 'chunk/' + filename,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: [srcDir],
                exclude: /(bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true, // 启用缓存
                        },
                    },
                ],
            },

            {
                test: /\.(css|less|scss)$/,
                use: [
                    {
                        loader: devMode
                            ? 'style-loader'
                            : MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                        },
                    },
                    'postcss-loader',
                ],
                // 兼容ant 不启用 css  modules
                include: [/node_modules/],
            },

            // {
            //     test: /\.scss$/,
            //     include: [path.join(__dirname, '../src/pages/home')],
            //     exclude: [/node_modules/],
            //     use: [
            //         'isomorphic-style-loader', //版本号的问题，被坑了好几天
            //         //'style-loader',
            //         {
            //             loader: 'css-loader', //版本号的问题，被坑了好几天 3.4.2
            //             options: {
            //                 modules: true,
            //             },
            //         },
            //         'postcss-loader',
            //         'sass-loader',
            //     ],
            // },
            {
                test: /\.scss$/,
                exclude: [
                    /node_modules/,
                    // path.join(__dirname, '../src/pages/home'),
                ],
                use: [
                    {
                        loader: devMode
                            ? 'style-loader'
                            : MiniCssExtractPlugin.loader,
                        options: {},
                    }, //版本号的问题，被坑了好几天
                    //'style-loader',
                    {
                        loader: 'css-loader', //版本号的问题，被坑了好几天
                        options: {
                            modules: false,
                        },
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            api: 'modern', // 使用现代 API
                            // api: 'modern-compiler', // 或使用 modern-compiler（功能更完整）
                            sassOptions: {
                                // 你的 sass 配置
                                silenceDeprecations: ['legacy-js-api'], // 可选：静默警告
                            },
                        },
                    },
                ],
            },

            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                type: 'asset',
                parser: {
                    //转base64的条件
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 25kb
                    },
                },
                generator: {
                    //与output.assetModuleFilename是相同的,这个写法引入的时候也会添加好这个路径
                    filename: 'img/[name].[hash:6][ext]',
                    //打包后对资源的引入，文件命名已经有/img了
                    //publicPath: '',
                },
                include: [srcDir, /\/node_modules\/antd-mobile\/es\/assets/],
            },
            {
                test: /\.(svg)$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',

                        options: {
                            // extract: true,
                            symbolId: 'icon-[name]',
                        },
                    },
                    'svgo-loader',
                ],
                exclude: [/node_modules/],
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                type: 'asset/resource',
                include: [srcDir],
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                type: 'asset/resource',
                include: [srcDir],
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.svga$/i,
                use: 'url-loader',
            },
        ],
    },
    plugins: [
        // 开启 happypack 的线程池
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                SUER: JSON.stringify(process.env.SUER),
            },
        }),
        //排除 eslint
        new ESLintPlugin({
            exclude: ['node_modules', 'ox-util'],
        }),
        // 复制一个 html 并将最后打包好的资源在 html 中引入
        new HtmlWebpackPlugin({
            // 页面title 需要搭配 ejs 使用
            title: 'webpack-react',
            // html 模板路径
            template: path.resolve(__dirname, '../index.html'),
            // 输出文件名称
            filename: 'index.html',
            meta: {
                buildTime: new Date().toLocaleString('zh-CN', {
                    timeZone: 'Asia/Shanghai',
                }),
            },
            scriptLoading: 'blocking',
            minify: {
                // 压缩HTML⽂件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: true, // 删除空⽩符与换⾏符
                minifyCSS: true, // 压缩内联css
            },
        }),

        //静态资源输出
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../src/assets/txt'),
                    to: './',
                },
            ],
        }),
        new webpack.ProvidePlugin({
            crypto: ['crypto'],
        }),
        //new AntdDayjsWebpackPlugin(),
    ],

    resolve: {
        extensions: ['.jsx', '.js', '.scss', '.css'],
        modules: [srcDir, 'node_modules'],
        alias: {
            // '/': srcDir,
            pages: `${srcDir}/pages`,
            crypto: false,
            '@': srcDir,
            'ox-util': path.resolve(__dirname, '../ox-util'),
        },
        fallback: {
            crypto: require.resolve('crypto-browserify'),
        },
    },
};
