module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jest: true,
        node: true,
    },
    extends: [
        'eslint:recommended', // create react app已安装，使用eslint中recommened的规则
        'plugin:react/recommended', // create react app已安装, recommended react linting configs
        'plugin:react-hooks/recommended', // create react app已安装, hooks相关的lint config
        'plugin:prettier/recommended', // 安装好Prettier再添加，可先删除
    ],
    plugins: ['prettier', 'react', 'react-hooks'],
    parser: '@babel/eslint-parser', // 需手动安装 @typescript-eslint/parser，This allows Eslint to understand TypeScript syntax
    parserOptions: {
        ecmaVersion: 11,
        ecmaFeatures: {
            jsx: true, // Allows for the parsing of JSX
        },
        sourceType: 'module', // Allows for the use of imports
        project: './tsconfig.json',
    },
    settings: {
        react: {
            pragma: 'React',
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    rules: {
        'no-debugger': 'off',
        'no-console': 'off',
        'no-unused-vars': [
            'error',
            {
                vars: 'all',
                args: 'none',
            },
        ],
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/no-unknown-property': [
            'error',
            {
                ignore: [
                    'p-id',
                    't',
                    'x5-video-player-type',
                    'webkit-playsinline',
                    'x5-video-player-fullscreen',
                    'x5-playsinline',
                    'x-webkit-airplay',
                ],
            },
        ],
    },
};
