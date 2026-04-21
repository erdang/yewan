const path = require('path');
const nodeExternals = require('webpack-node-externals');
//const webpack = require('webpack');

const serverConfig = {
    mode: 'production',
    context: path.resolve(__dirname, '../suer/'),
    entry: { server: path.resolve(__dirname, './server/sever-entry.js') },
    output: {
        path: path.resolve(__dirname, 'build/static/js'),
        filename: 'bundle.js',
    },
    target: 'node',
    node: {
        __filename: true,
        __dirname: true,
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/react', '@babel/env'],
                },
            },

            {
                test: /\.css|scss?$/,
                use: [
                    'isomorphic-style-loader',
                    'css-loader',
                    'sass-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(jpg|png|gif|webp)$/,
                loader: 'url?limit=8000',
            },
            {
                test: /\.json$/,
                loader: 'json',
            },
        ],
    },
    externals: [nodeExternals()],
    resolve: { extensions: ['*', '.js', '.json', '.scss'] },
    plugins: [
        // new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: { warnings: false },
        //     comments: false,
        // }),
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        // }),
    ],
};

module.exports = serverConfig;
