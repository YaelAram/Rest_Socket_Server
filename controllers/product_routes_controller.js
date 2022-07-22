const { response, request } = require("express");

const { uploadFile, destroyFile } = require( '../helpers/upload_file' );
const Product = require( '../model/product' );
const Section = require( '../model/section' );

const FOLDER_NAME = 'product';

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const getProducts = async ( req, res ) => {
    const { limit = 5, startAt = 0 } = req.query;
    const [ products, numberOfProducts ] = await Promise.all( [
        Product.find( { state: true } ).skip( Number( startAt ) ).limit( Number( limit ) )
            .populate( 'user', 'name email' ).populate( 'section', 'name' ),
        Product.countDocuments( { state: true } )
    ] );
    res.status( 201 ).json( { numberOfProducts, products } );
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const getProductByID = async ( req, res ) => {
    const { id } = req.params;
    const product = await Product.findById( id ).populate( 'user', 'name email' ).populate( 'section', 'name' );
    if( !product ) return res.status( 404 ).json( { message: `Product with ID: ${ id } does not exists` } );
    if( !product.state ) return res.status( 400 ).json( { message: `That product was deleted` } );
    res.status( 200 ).json( { product } );
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const createProduct = async ( req, res ) => {
    const { uid } = req;
    const { name, description, section_name } = req.body;
    const section = await Section.findOne( { name: section_name.toUpperCase() } );

    if( !section ) return res.status( 404 ).json( { message: `Section ${ section_name } is not in the DB` } );

    const data = {
        name: name.toUpperCase(),
        state: true,
        available: true,
        description,
        img: '',
        user: uid,
        section: section._id
    };

    const secure_url = await uploadFile( req, undefined, FOLDER_NAME );
    if( secure_url ) data.img = secure_url;

    const product = new Product( data );
    await product.save(); 
    res.status( 200 ).json( { message: `Product ${ name } successfully created` } );
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const updateProduct = async ( req, res ) => {
    const { uid } = req;
    const { id } = req.params;
    const { _id, name, available, state, img, section_name, section, user, ...productInfo } = req.body;

    const secure_url = await uploadFile( req, undefined, FOLDER_NAME );
    if( secure_url ) productInfo.img = secure_url;
    
    if( section_name ){
        const section = await Section.findOne( { name: section_name.toUpperCase() } );
        if( !section ) return res.status( 404 ).json( { message: `Section ${ section_name } is not in the DB` } );
        productInfo.section = section._id;
    }
    if( typeof available === 'boolean' ) productInfo.available = available;
    if( name ) productInfo.name = name.toUpperCase();
    productInfo.user = uid;

    const product = await Product.findByIdAndUpdate( id, productInfo );
    if( product.img ) await destroyFile( product.img, FOLDER_NAME );
    res.status( 200 ).json( { message: `Product with ID: ${ product._id } has been updated` } );
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const deleteProduct = async ( req, res ) => {
    const { uid } = req;
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate( id, { state: false, user: uid } );
    res.status( 200 ).json( { message: `Product ${ product.name } successfully deleted` } );
};

module.exports = {
    getProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct
};
