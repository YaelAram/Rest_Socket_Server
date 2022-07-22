const { response, request } = require("express");
const bcryptjs = require( 'bcryptjs' );

const User = require( '../model/user' );
const { createJWT } = require( '../helpers/jwt' );
const googleVerify = require( '../helpers/google_verify' );

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const login = async ( req, res ) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne( { email } );
        // Check if the email is in the database
        if( !user ) return res.status( 400 ).json( { message: 'That email is not in the database' } );
        // Check the status
        if( !user.state ) return res.status( 400 ).json( { message: 'This account is inactive' } );
        // Check if the account was created by Google Sign-In
        if( user.google ) return res.status( 400 ).json( { message: 'Sign In using the Google Sign In button below' } );
        // Check password
        const validation = bcryptjs.compareSync( password, user.password );
        if( !validation ) return res.status( 400 ).json( { message: 'Wrong password' } );
        // Create JWT
        const token = await createJWT( user._id );
        res.json( { message: '', token } );
    }
    catch( error ){
        console.log( error );
        res.status( 500 ).json( { message: 'Something went wrong' } );
    }
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const googleLogin = async ( req, res ) => {
    const { id_token } = req.body;
    try{
        const { name, email, picture } = await googleVerify( id_token );
        let user = await User.findOne( { email } );
        if( !user ){
            user = new User( { name, email, password: 'ASDASD', img: picture, google: true } );
            await user.save();
        }
        if( !user.state ) return res.status( 401 ).json( { message: 'That user is inactive' } );
        const token = await createJWT( user.id );
        res.json( { message: '', email: user.email, token } );
    }
    catch( error ){ res.status( 500 ).json( { message: 'Google Sign In failed' } ); }
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const validateJWT = async ( req, res ) => {
    const { uid } = req;
    const user = await User.findById( uid );
    if( !user.state ) return res.status( 400 ).json( { message: 'That user is inactive' } );
    const token = await createJWT( uid );
    res.status( 200 ).json( { token, uid: user._id, name: user.name, email: user.email } );
};

module.exports = {
    login,
    googleLogin,
    validateJWT
};
