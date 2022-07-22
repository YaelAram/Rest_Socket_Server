const { response, request } = require("express");

const Section = require( '../model/section' );

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const getSections = async ( req, res ) => {
    const { limit = 5, startAt = 0 } = req.query;
    
    const [ sections, numberOfSections ] = await Promise.all( [
        Section.find( { state: true } ).skip( Number( startAt ) ).limit( Number( limit ) ).populate( 'user', 'name email' ),
        Section.countDocuments( { state: true } )
    ] );

    res.status( 201 ).json( { numberOfSections, sections } );
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const getSectionById = async ( req, res ) => {
    const { id } = req.params;
    const section = await Section.findById( id ).populate( 'user' );

    if( !section.state ) return res.status( 404 ).json( { message: `The section with ID: ${ id } was deleted` } );
    return res.status( 200 ).json( { section } );
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const createSection = async ( req, res ) => {
    const { uid } = req;
    let { name } = req.body;

    name = name.toUpperCase();
    const section = new Section( { name, state: true, user: uid } );
    await section.save();

    res.status( 200 ).json( { message: `Section ${ name } created successfully` } );
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const updateSection = async ( req, res ) => {
    const { uid } = req;
    const { id } = req.params;
    const { name } = req.body;

    const updatedSection = await Section.findByIdAndUpdate( id, { name, user: uid } );
    res.status( 200 ).json( { message: `Section with ID: ${ id } updated to ${ name }` } );
};

/**
 * 
 * @param { request } req 
 * @param { response } res 
 */
const deleteSection = async ( req, res ) => {
    const { id } = req.params;
    const { uid } = req;

    const deletedSection = await Section.findByIdAndUpdate( id, { state: false, user: uid } );
    res.status( 200 ).json( { message: `Section with ID: ${ id } was deleted by user with ID: ${ uid }` } );
};

module.exports = {
    getSections,
    getSectionById,
    createSection,
    updateSection,
    deleteSection
}
