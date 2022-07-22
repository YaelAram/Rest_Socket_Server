const { response, request } = require( 'express' );

const User = require( '../model/user' );

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const checkRoleDelete = async ( req, res, next ) => {
    if( !req.uid ) return res.status( 401 ).json( { message: 'UID was not included on the request' } );
    const user = await User.findById( req.uid );
    if( !user ) return res.status( 401 ).json( { message: 'That user does not exists' } );
    if( !user.state ) return res.status( 401 ).json( { message: 'That user is inactive' } );
    if( !( [ 'ADMIN_ROLE' ].includes( user.role ) ) ) return res.status( 401 ).json( { message: 'Forbiden' } );
    next();
};

module.exports = {
    checkRoleDelete
};
