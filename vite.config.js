import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import eslint from 'vite-plugin-eslint';
import postcsspxtoviewport from 'cnjm-postcss-px-to-viewport';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';
import postcssAspectRatioMini from 'postcss-aspect-ratio-mini';
import postcssPresetEnv from 'postcss-preset-env';
import postcssWriteSvg from 'postcss-write-svg';
import postcssViewportUnits from 'postcss-viewport-units';
import cssnano from 'cssnano';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
//import vitePluginImp from 'vite-plugin-imp';

const path = require('path');
const srcDir = path.join(__dirname, './src');

const os = require('os');

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

let publicPath = 'http://' + localIP + ':3000/';
console.log(publicPath);
export default defineConfig(({ mode }) => {
    // 加载环境变量，因为 vite 中不会加载以 VUE 开头的，我们得自己指定下
    const envPrefix = ['VUE'];
    const env = loadEnv(mode, process.cwd(), envPrefix);

    return {
        root: './', // index.html 存在的位置
        base: './', // 指定请求资源路径(URL)的前缀, 默认 ./
        mode: 'development', // 命令行启动时 --mode 同理, 指定 env, 默认 "development"(开发模式) "production" (生产模式)
        define: '', // ≈ rollup 的 definePlugin, 定义全局常量的替换方式
        publicDir: '/src/assets', //静态资源存放目录
        cacheDir: '', // 开发1时用到的缓存存放目录, 默认"node_modules/.vite"

        css: {
            preprocessorOptions: {
                scss: {
                    javascriptEnabled: true,
                    silenceDeprecations: ['legacy-js-api'],
                    // additionalData: `@use "./src/common/base.scss";`,
                },
            },
            postcss: {
                plugins: [
                    autoprefixer,
                    postcssImport,
                    postcssUrl,
                    postcssAspectRatioMini,
                    postcssPresetEnv,
                    postcssWriteSvg({
                        utf8: false,
                    }),
                    postcssViewportUnits({
                        filterRule: (rule) =>
                            rule.nodes.findIndex(
                                (i) => i.prop === 'content',
                            ) === -1,
                    }),
                    cssnano({
                        'cssnano-preset-advanced': {
                            zindex: false,
                            autoprefixer: false,
                        },
                    }),
                    postcsspxtoviewport({
                        unitToConvert: 'px', // 要转化的单位
                        viewportWidth: 750, // UI设计稿的宽度
                        unitPrecision: 6, // 转换后的精度，即小数点位数
                        propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
                        viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
                        fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
                        selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类名，
                        minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
                        mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
                        replace: true, // 是否转换后直接更换属性值
                        exclude: [], // 设置忽略文件，用正则做目录名匹配
                        landscape: false, // 是否处理横屏情况
                        // 如果没有使用其他的尺寸来设计，下面这个方法可以不需要，比如vant是375的
                        customFun: ({ file }) => {
                            // 这个自定义的方法是针对处理vant组件下的设计稿为375问题
                            const designWidth = path
                                .join(file)
                                .includes(
                                    path.join('node_modules', 'antd-mobile'),
                                )
                                ? 375
                                : 750;
                            return designWidth;
                        },
                    }),
                ],
            },
        },
        plugins: [
            eslint({
                exclude: ['./ox-util/**'],
                cache: false,
            }),
            react({
                babel: {
                    plugins: ['@babel/plugin-transform-react-jsx'],
                },
            }),
            createSvgIconsPlugin({
                // 指定需要缓存的图标文件夹
                iconDirs: [
                    path.resolve(process.cwd(), './src/assets/icon/svg/'),
                ],
                // 指定symbolId格式
                symbolId: 'icon-[name]',
            }),

            createHtmlPlugin({
                minify: true,
                template: './index.html',
                entry: '/src/main.js', // 这个会帮我们注入入口 js 文件
                inject: {
                    data: {
                        // 这是我们 index.html 用到的环境变量
                        ...env,
                    },
                },
            }),
            // vitePluginImp({
            //     libList: [
            //         {
            //             libName: 'antd-mobile',
            //             libDirectory: 'es/components',
            //             style: (name) => `antd-mobile/es/components/${name}`,
            //         },
            //     ],
            // }),
        ],
        resolve: {
            extensions: ['.jsx', '.js', '.scss', '.css'],
            modules: [srcDir, 'node_modules'],
            alias: {
                pages: `${srcDir}/pages`,
                '@': srcDir,
                'ox-util': path.resolve(__dirname, './ox-util'),
            },
            fallback: {
                crypto: require.resolve('crypto-browserify'),
            },
        },
        optimizeDeps: {
            exclude: ['crypto'],
            include: ['axios'],
        },
        server: {
            port: 3000,
            open: false,
            host: '0.0.0.0',
            // hmr: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Token' || 'token',
            },
            // origin: 'http://127.0.0.1:8080',
            proxy: {
                '/api/v1': {
                    target: 'https://dev-api.njxianyuwl.cn',
                    changeOrigin: true,
                    // rewrite: (path) => path.replace(/^\/api\/v1/, ''),
                },
                '/api/activity': {
                    target: 'https://dev-gate.njxianyuwl.cn',
                    changeOrigin: true,
                    // rewrite: (path) => path.replace(/^\/v2/, ''),
                },
                '/api/tour': {
                    target: 'https://dev-gate.njxianyuwl.cn',
                    changeOrigin: true,
                    // rewrite: (path) => path.replace(/^\/v2/, ''),
                },
            },
        },
    };
});
