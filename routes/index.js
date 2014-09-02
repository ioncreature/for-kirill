/**
 * @author Alexander Marenin
 * @date July 2014
 */

const RE_PNG_IMAGE = /.png$/;

var router = require( 'express' ).Router(),
    util = require( '../lib/util' ),
    registry = require( '../lib/registry' ),
    fs = require( 'fs' ),
    path = require( 'path' ),
    join = path.join,
    async = require( 'async' ),
    config = registry.get( 'config' ),
    route = config.route,
    exec = require('child_process').exec;

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
    var files = Object.keys( req.files ).map( function( file ){
            return req.files[file].path;
        }),
        dirName = Date.now().toString(),
        sourceDir = join( config.uploadsDir, dirName ),
        destDir = join( config.downloadDir, dirName ),
        xmlPath = join( sourceDir, 'xml.xml' );

    fs.mkdirSync( sourceDir );
    fs.mkdirSync( destDir );
    fs.writeFileSync( xmlPath, req.body.xml );
    files.forEach( function( file ){
        var destPath = join( sourceDir, path.basename(file) );
        fs.renameSync( file, destPath );
    });

    exec( makeCommand({
            srcDir: sourceDir,
            xmlPath: xmlPath,
            destDir: destDir,
            front: !!req.body.front,
            back: !!req.body.back,
            rotateX: Number( req.body.rotateX ),
            rotateY: Number( req.body.rotateY ),
            rotateZ: Number( req.body.rotateZ )
        }), function( error ){
            if ( error )
                next( error );
            else
                res.redirect( util.formatUrl(route.DIRECTORY, {folder: dirName}) );
        }
    );
});


function makeCommand( options ){
    console.log( options );
    return 'xyz';
}
