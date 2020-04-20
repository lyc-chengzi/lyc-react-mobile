const path = require('path');
const babelConfig = require('./babelrc.lib');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: process.env.mode,
    resolve: {
        extensions: ['.ts', '.tsx', '.less', '.js', '.css']
    },
    entry: {
        "lycReact-m": path.resolve(__dirname, 'src/index.ts'),
        "css": path.resolve(__dirname, 'src/style/all.ts')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].min.js"
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style/[name].css',  // 打包后从js文件中提取出来的css文件名称
        }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.([jt])sx$/,
                // include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: "babel-loader",
                        options: babelConfig
                    }
                ]
            }
        ]
    }
};
