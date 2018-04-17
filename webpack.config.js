'use strict';
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const PATHS = {
    src: path.resolve(__dirname, 'src'),
    dist: path.resolve(__dirname, 'dist')
};

let conf = {
    entry: [
        path.join(PATHS.src, '/js/main.js'),
        path.join(PATHS.src, '/scss/style.scss')
    ],
    output: {
        path: PATHS.dist,
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                include: path.join(PATHS.src, 'scss'),
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                minimize: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options : {
                                sourceMap : true
                            }
                        }
                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.pug$/,
                use: [{
                    loader: "pug-loader",
                    options: {
                        pretty: true
                    }
                }],

            }, 
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: 'env'
                    }
                }
            },
            {
                test: /\.svg$/,
                loader: 'svg-url-loader'
            }   
            
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(PATHS.src, '/html/index.pug'),
            inject: false
        }),
        new ExtractTextPlugin({
            filename: 'css/styles-[name].css'
        }),
        new CopyWebpackPlugin([
            {
                from: './src/fonts',
                to: './fonts'
            },
            {
                from: './src/favicon',
                to: './favicon'
            },
            {
                from: './src/img',
                to: './img'
            }
        ])
    ],
    devServer: {
        overlay: true,
        contentBase: './dist'
    }
};

module.exports = (env, options) => {
    let production = options.mode === 'production';

    conf.devtool = production ? 'source-map' : 'eval-sourcemap';

    return conf;
}
