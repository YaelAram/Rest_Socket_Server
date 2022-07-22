const { Request, Response } = require( 'express' );
const { ObjectId } = require( 'mongoose' ).Types;

const User = require( '../model/user' );
const Section = require( '../model/section' );
const Product = require( '../model/product' );

/**
 * 
 * @param { String } attribute 
 * @param { Response } res 
 */
const userSearch = async ( attribute, res ) => {
    if( ObjectId.isValid( attribute ) ){
        const user = await User.findById( attribute );
        return res.status( 200 ).json( { results: ( user ) ? [ user ] : [] } );
    }
    const regex = new RegExp( attribute, 'i' );
    const results = await User.find( {
        $or: [ { name: regex }, { email: regex } ],
        $and: [ { state: true } ]
    } );
    res.status( 200 ).json( { results } );
};

/**
 * 
 * @param { String } attribute 
 * @param { Response } res 
 */
const sectionSearch = async ( attribute, res ) => {
    if( ObjectId.isValid( attribute ) ){
        const results = await Section.find( {
            $or: [ { _id: ObjectId( attribute ) }, { user: ObjectId( attribute ) } ],
            $and: [ { state: true } ]
        } );
        return res.status( 200 ).json( results );
    }
    const regex = new RegExp( attribute, 'i' );
    const results = await User.find( { name: regex, state: true } );
    res.status( 200 ).json( { results } );
};

/**
 * 
 * @param { String } attribute 
 * @param { Response } res 
 */
const productSearch = async ( attribute, res ) => {
    if( ObjectId.isValid( attribute ) ){
        const results = await Product.find( {
            $or: [ { _id: ObjectId( attribute ) }, { user: ObjectId( attribute ) }, { section: ObjectId( attribute) } ],
            $and: [ { state: true } ]
        } );
        return res.status( 200 ).json( results );
    }
    const regex = new RegExp( attribute, 'i' );
    const sections = ( await Section.find( { name: regex } ) ).map( ( value ) => value._id );
    if( sections ){
        const results = await Product.find( { section: { $in: sections }, state: true } )
                .populate( 'section', 'name' ).populate( 'user', 'name email' );
        return res.status( 200 ).json( results );
    }
    const results = await User.find( {
        $or: [ { name: regex }, { description: regex } ],
        $and: [ { state: true } ]
    } );
    res.status( 200 ).json( { results } );
};

const collections = {
    'USERS': userSearch,
    'SECTIONS': sectionSearch,
    'PRODUCTS': productSearch
};

/**
 * 
 * @param { Request } req 
 * @param { Response } res 
 */
const search = async ( req, res ) => {
    const { collection, attribute } = req.params;
    if( !Object.keys( collections ).includes( collection.toUpperCase() ) ) 
        return res.status( 400 ).json( `Collection ${ collection.toUpperCase() } is not allowed or non-existent` );
    await collections[ collection.toUpperCase() ]( attribute, res );
};

module.exports = {
    search
};
