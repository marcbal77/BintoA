
/* eslint-disable no-console */

/**
 * External dependencies.
 */
var boot = require( 'boot' ),
	http = require( 'http' ),
	chalk = require( 'chalk' );

/**
 * Internal dependencies
 */

// variable for package and configuration requirements
var pkg = require( './package.json' ),
	config = require( 'config' );
// variable for state of process between portal and host for booting/compiler
var start = Date.now(),
	port = process.env.PORT || 3000,
	host = process.env.HOST || config( 'hostname' ),
	app = boot(),
	server,
	compiler,
	hotReloader;
// boot status from non-fork
function sendBootStatus( status ) {
	// don't send anything if we're not running in a fork
	if ( ! process.send ) {
		return;
	}
	process.send( { boot: status } );
}

// console - info
console.log( chalk.yellow( '%s booted in %dms - http://%s:%s' ), pkg.name, ( Date.now() ) - start, host, port );
// console - info
console.info( chalk.cyan( '\nGetting bundles ready, hold on...' ) );

// server hookup to app
server = http.createServer( app );

// The desktop app runs Calypso in a fork.
// Let non-forks listen on any host.
if ( ! process.env.CALYPSO_IS_FORK ) {
	host = null;
}

server.listen( { port, host }, function() {
	// Tell the parent process that Calypso has booted.
	sendBootStatus( 'ready' );
} );

// Enable hot reloader in development
if ( config( 'env' ) === 'development' ) {
	hotReloader = require( 'bundler/hot-reloader' );
	compiler = app.get( 'compiler' );

	compiler.plugin( 'compile', function() {
		sendBootStatus( 'compiler compiling' );
	} );
	compiler.plugin( 'invalid', function() {
		sendBootStatus( 'compiler invalid' );
	} );
	compiler.plugin( 'done', function() {
		sendBootStatus( 'compiler done' );
	} );

	hotReloader.listen( server, compiler );
}