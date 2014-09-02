/**
 * @author Alexander Marenin
 * @date July 2014
 */

const RE_PNG_IMAGE = /.png$/;

var router = require( 'express' ).Router(),
    util = require( '../lib/util' ),
    registry = require( '../lib/registry' ),
    fs = require( 'fs' ),
    join = require( 'path' ).join,
    async = require( 'async' ),
    config = registry.get( 'config' ),
    route = config.route;

module.exports = router;


router.get( route.INDEX, function( req, res ){
    res.render( 'page/list', {
        pageName: 'list',
        pageTitle: 'List',
        list: fs
            .readdirSync( config.downloadDir )
            .map( function( item ){
                var stat = fs.statSync( join(config.downloadDir, item) );
                return {
                    name: item,
                    isFolder: stat.isDirectory(),
                    create: stat.mtime,
                    url: util.formatUrl( route.DIRECTORY, {folder: item} )
                };
            })
            .filter( function( item ){
                return item.isFolder;
            })
    });
});


router.get( route.DIRECTORY, function( req, res ){
    var folder = req.params.folder,
        files = fs
            .readdirSync( join(config.downloadDir, folder) )
            .filter( function( file ){
                return RE_PNG_IMAGE.test( file );
            })
            .map( function( file ){
                return util.formatUrl( route.IMAGE, {folder: folder, file: file} );
            });

    res.render( 'page/directory', {
        pageName: 'list',
        pageTitle: folder,
        files: files
    });
});


router.get( route.FORM, function( req, res ){
    res.render( 'page/form', {
        pageName: 'form',
        pageTitle: 'Form',
        postUrl: route.FORM
    });
});


router.post( route.FORM, function( req, res, next ){
    var files = req.files;

    res.redirect( route.INDEX );
});
