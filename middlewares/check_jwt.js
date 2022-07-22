const { response, request } = require( 'express' );
const jwt = require( 'jsonwebtoken' );

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const checkJWT = ( req, res, next ) => {
    const token = req.header( 'auth_token' );
    if( !token ) return res.status( 401 ).json( { message: 'Token not found' } );
    try{
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        req.uid = uid;
        next();
    }
    catch( error ){
        return res.status( 401 ).json( { message: 'Wrong Token' } );
    }
};

module.exports = checkJWT;
