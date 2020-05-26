const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = ( env ) => {
    let config = {
        mode: 'development',
        optimization: {
            minimize: env.NODE_ENV === 'production'
        },
        entry: ['babel-polyfill', './src/ppMovableScene.js', './src/ppMovableScene.scss'],
        output: {
            library: 'ppMovableScene',
            libraryTarget: 'umd',
            path: path.resolve(__dirname, "dist"),
            filename: env.NODE_ENV === 'develop' ? 'ppmovablescene.js' : 'ppmovablescene.min.js'
        },
        module: {
            rules: [
                {
                    // Expose global PPMovableScene() function
                    test: require.resolve("./src/ppMovableScene"),
                    use: [{
                        loader: 'expose-loader',
                        options: 'PPMovableScene'
                    }],
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                }, {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader?limit=10000&mimetype=application/font-woff&name=[hash].[ext]&outputPath=assets/font/'
                }, {
                    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: 'file-loader?limit=10000&name=[hash].[ext]&outputPath=assets/font/'
                }, {
                    test: /\.(gif|png|jpe?g|svg)$/,
                    loader: 'file-loader?name=[name].[ext]&outputPath=assets/images/',
                }, {
                    test: /\.(sass|scss)$/,
                    use: ExtractTextPlugin.extract({
                        use: [{
                            loader: 'css-loader',
                            options: {
                                minimize: env.NODE_ENV === 'production',
                            }
                        }, {
                            loader: 'postcss-loader'
                        }, {
                            loader: 'sass-loader'
                        }]
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: env.NODE_ENV === 'develop' ? 'ppmovablescene.css' : 'ppmovablescene.min.css',
                allChunks: false
            })
        ]
    }

    if ( env.NODE_ENV === 'production' ) {
        config.plugins.push( new UglifyJsPlugin() );
    }

    return config;
};