module.exports = (source) => {
    const designWidth =
        source.file.indexOf('node_modules/antd-mobile') > -1 ? 375 : 750;
    return {
        plugins: {
            autoprefixer: {},
            'postcss-import': {},
            'postcss-url': {},
            'postcss-aspect-ratio-mini': {},
            'postcss-write-svg': { utf8: false },
            'postcss-preset-env': {},
            'postcss-px-to-viewport-8-plugin': {
                viewportWidth: designWidth, // (Number) The width of the viewport.
                viewportHeight: 1334, // (Number) The height of the viewport.
                unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
                viewportUnit: 'vw', // (String) Expected units.
                selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
                minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
                mediaQuery: false, // (Boolean) Allow px to be converted in media queries.
            },
            'postcss-viewport-units': {
                filterRule: (rule) =>
                    rule.nodes.findIndex((i) => i.prop === 'content') === -1,
            },

            cssnano: {
                'cssnano-preset-advanced': {
                    zindex: false,
                    autoprefixer: false,
                },
                // preset: 'advanced',
                // autoprefixer: false,
                // 'postcss-zindex': false,
            },
        },
    };
};
