/**
 * @author Alexander Marenin
 * @date July 2014
 */

exports.title = 'Card Form';
exports.processTitle = 'card-form';
exports.uploadsDir = require( 'path' ).join( __dirname, '../uploads' );
exports.downloadDir = require( 'path' ).join( __dirname, '../public/download' );

exports.route = {
    PUBLIC: '/public',
    PUBLIC_CSS: '/public/css',
    INDEX: '/',
    FORM: '/form',
    DIRECTORY: '/directory/:folder',
    IMAGE: '/public/download/:folder/:file'
};
