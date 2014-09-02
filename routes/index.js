/**
 * @author Alexander Marenin
 * @date July 2014
 */

const IGNORE_FILES = ['.', '..'];

var router = require( 'express' ).Router(),
    registry = require( '../lib/registry' ),
    fs = require( 'fs' ),
    async = require( 'async' ),
    config = registry.get( 'config' ),
    route = config.route;

module.exports = router;

router.get( route.INDEX, function( req, res ){
    res.render( 'page/list', {
        pageName: 'list',
        pageTitle: 'List',
        list: fs.readdirSync( config.downloadDir ).filter( function( item ){
            return IGNORE_FILES.indexOf( item ) === -1;
        })
    });
});

router.get( route.FORM, function( req, res, next ){
    res.render( 'page/form', {
        pageName: 'form',
        pageTitle: 'Form',
        postUrl: route.FORM
    });
});

router.post( route.FORM, function( req, res, next ){
    res.redirect( route.INDEX );
});
