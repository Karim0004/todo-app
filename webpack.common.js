const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	plugins: [new HtmlWebpackPlugin({
		template: './src/template.html'
	})],
	module: {
		rules: [
			{
				test: /\.html&/,
				use: ['html-loader']
			},
			{
				test: /\.(png|jpg|gif|jpeg|svg)$/,
				use: {
					loader: 'img-optimize-loader',
					options: {
						name: '[name].[hash].[ext]',
						outputPath: 'assets',
						compress: {
							webp: true,
							mode: 'high'
						}
					}
				}
			}
		]
	}
};
