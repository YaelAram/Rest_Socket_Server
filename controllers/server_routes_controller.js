const { response, request } = require("express");

const User = require( '../model/user' );
const encryptPassword = require( '../database/encrypt' );
const { uploadFile, destroyFile } = require( '../helpers/upload_file' );

const FOLDER_NAME = 'user';

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const getRequest = async ( req, res ) => {
    const { limit = 5, startAt = 0 } = req.query;

    const [ users, numberOfUsers ] = await Promise.all( [
        User.find( { state: true } ).skip( Number( startAt ) ).limit( Number( limit ) ),
        User.countDocuments( { state: true } )
    ] );

    res.json( { numberOfUsers, users } );
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const postRequest = async ( req, res ) => {
    const { name, email, password, role } = req.body;
    const user = new User( { name, email, password, role, img: '' } );

    user.password = encryptPassword( password );
    await user.save();

    res.json( { user } );
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const putRequest = async ( req, res ) => {
    const { id } = req.params;
    const { _id, password, google, state, img, ...newUserInfo } = req.body;

    const secure_url = await uploadFile( req, undefined, FOLDER_NAME );
    if( secure_url ) newUserInfo.img = secure_url;
    if( password ) newUserInfo.password = encryptPassword( password );
    const user = await User.findByIdAndUpdate( id, newUserInfo );

    if( user.img ) await destroyFile( user.img, FOLDER_NAME );

    res.json( { message: `User with id ${ id } has been updated` } );
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const deleteRequest = async ( req, res ) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate( id, { state: false } );
    res.json( { user } );
};

module.exports = {
    getRequest,
    postRequest,
    putRequest,
    deleteRequest
};
