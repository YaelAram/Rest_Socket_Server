const cloudinary = require( 'cloudinary' ).v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const checkExtension = ( name = '', extensions = [] ) => {
    const extension = name.split( '.' ).pop();
    return extensions.includes( extension );
};

const uploadFile = async ( req, extensions = [ 'png', 'jpg', 'jpeg' ], folder = '' ) => {
    if ( !req.files || Object.keys( req.files ).length === 0 || !req.files.file ) return '';
    const { tempFilePath, name } = req.files.file;
    if( !checkExtension( name, extensions ) ) return '';
    try{
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath, { folder } );
        return secure_url;
    }
    catch( error ){ 
        console.log( error );
    }
};

const destroyFile = async ( name = '', folder = '' ) => {
    const publicID = name.split( '/' ).pop().split( '.' ).shift();
    await cloudinary.uploader.destroy( `${ folder }/${ publicID }` );
};

module.exports = {
    uploadFile,
    destroyFile
};
