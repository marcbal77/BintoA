/**
 * External Dependencies
 */
const path = require( 'path' );
const webpack = require( 'webpack' );

/**
 * Internal Dependencies
 */
const config = require( './server/config' );

const bundleEnv = config( 'env' );

module.exports = {
	entry: {
		vendor: [
			'classnames',
			'i18n-calypso',
			'moment',
			'page',
			'react',
			'react-dom',
			'react-redux',
			'redux',
			'redux-thunk',
			'store',
			'wpcom',
		]
	},
	// output path
	output: {
		path: path.join( __dirname, 'public' ),
		publicPath: '/calypso/',
		filename: '[name].' + bundleEnv + '.js',
		library: '[name]',
		devtoolModuleFilenameTemplate: 'app:///[resource-path]'
	},
	//plugin add 
	plugins: [
		new webpack.DllPlugin( {
			path: path.join( __dirname, 'build', 'dll', '[name].' + bundleEnv + '-manifest.json' ),
			name: '[name]',
			context: path.resolve( __dirname, 'client' )
		} ),
		new webpack.DefinePlugin( {
			'process.env': {
				NODE_ENV: JSON.stringify( bundleEnv )
			}
		} ),
		new webpack.optimize.OccurenceOrderPlugin()
	],
	// Module Specitifity enhancement
	module: {
		//load JSON and HTML
		loaders: [
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			}
		]
	},
	// Node pull
	node: {
		console: false,
		process: true,
		global: true,
		Buffer: true,
		__filename: 'mock',
		__dirname: 'mock',
		fs: 'empty'
	},
	// Resolve pull - root path
	resolve: {
		root: path.resolve( __dirname, 'client' )
	}
};