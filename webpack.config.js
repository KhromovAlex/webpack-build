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
    entry: {
        index: [PATHS.src + '/templates/pages/index/index.js', PATHS.src + '/scss/index.scss'],
        page2: [PATHS.src + '/templates/pages/page2/page2.js', PATHS.src + '/scss/index.scss']
    },
    output: {
        path: PATHS.dist,
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
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
            template: PATHS.src + '/templates/pages/index/index.pug',
            excludeChunks: ['page2']
        }),
        new HtmlWebpackPlugin({
            template: PATHS.src + '/templates/pages/page2/page2.pug',
            filename:'page2.html',
            excludeChunks: ['index']
        }),
        new ExtractTextPlugin({
            filename: 'css/main.css'
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
        contentBase: PATHS.dist,
            stats: {
                assets: false,
                entrypoints: false,
                modules: false
            }
    },
    optimization: {
        splitChunks: {
          cacheGroups: {
            vendors: {
              chunks: 'all',
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              enforce: true
            },
          }
        }
      }
};

module.exports = (env, options) => {
    let production = options.mode === 'production';

    conf.devtool = production ? 'source-map' : 'eval-sourcemap';

    return conf;
}
