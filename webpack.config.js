const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

module.exports = function (env) {
	let plugins = [
		new webpack.ProvidePlugin({
			THREE: 'three',
			CANNON: 'cannon'
		}),
		// clean export folder
		new CleanWebpackPlugin('dist', {
			root: __dirname
		}),
		// create vendor bundle with all imported node_modules
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module) {
				return module.context && module.context.indexOf('node_modules') !== -1;
			}
		}),
		// create webpack manifest separately
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest'
		}),
		// create html
		new HtmlWebpackPlugin({
			template: 'index.html',
			chunksSortMode: 'dependency'
		}),
		new ExtractTextWebpackPlugin("styles.css"),
	];
	if (env == 'dev') {


	}
	else {

		// uglify
		plugins.push(new UglifyJSPlugin({
			sourceMap: false,
			compress: {
				warnings: false,
			},
		}));
	}

	return {
		context: path.resolve(__dirname, 'app'),
		devServer: {
			host: "0.0.0.0",
			disableHostCheck: true
		},
		entry: {
			main: './index.js'
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: env == 'prod' ? '[name].[chunkhash].js' : '[name].js',
		},
		module: {
			rules: [{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			}, {
				test: [/\.mp3$/, /\.dae$/, /\.jpg$/, /\.obj$/, /\.fbx$/],
				use: ['file-loader?name=[path][name].[hash].[ext]']
			},
				{
					test: /\.scss$/,
					use: ExtractTextWebpackPlugin.extract({
						fallback: 'style-loader',
						use: ['css-loader', 'sass-loader', 'postcss-loader'],
					})
				}
			],
		},
		devtool: env == 'dev' ? 'cheap-eval-source-map' : '',
		plugins: plugins,
	}
};
