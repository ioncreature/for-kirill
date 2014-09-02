/**
 * @author Alexander Marenin
 * @date July 2014
 */

var express = require( 'express' ),
    join = require( 'path' ).join,
    favicon = require( 'serve-favicon' ),
    logger = require( 'morgan' ),
    bodyParser = require( 'body-parser' ),
    multer = require( 'multer' ),
    lessMiddleware = require( 'less-middleware' ),
    registry = require( './registry' ),
    app = express(),
    util = require( './util' ),
    config = registry.get( 'config' ),
    route = config.route,
    publicDir = join( __dirname, '..', 'public' ),
    index = require( '../routes/index' );

app.set( 'views', join(__dirname, '..', 'views') );
app.set( 'view engine', 'jade' );
app.set( 'view cache', !config.debug );
app.disable( 'x-powered-by' );
app.set( 'json spaces', '    ' );

app.locals.route = config.route;
app.locals.title = config.title;
app.locals.formatUrl = util.formatUrl;

app.use( favicon(join(publicDir, 'favicon.ico')) );
app.use( config.debug ? logger('dev') : logger() );
config.debug && app.use( route.PUBLIC_CSS, lessMiddleware(join(publicDir, 'less'), {
    dest: join(publicDir, 'css'),
    prefix: 'css',
    force: false
}));
app.use( route.PUBLIC, express.static(publicDir) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({extended: true}) );
app.use( multer({dest: config.uploadsDir}) );
app.use( route.INDEX, index );

app.use( function( req, res, next ){
    var err = new Error( 'Not Found' );
    err.status = 404;
    next( err );
});

app.use( function( err, req, res, next ){
    res.status( err.status || 500 );
    res.render( 'page/error', {
        pageName: 'error',
        pageTitle: 'Error occurred',
        message: err.message,
        error: config.debug ? err : ''
    });
});


require( 'http' ).createServer( app ).listen( config.port, function( error ){
    if ( error )
        util.abort( error );
    else
        console.log( 'Server listening on port ', config.port );
});
