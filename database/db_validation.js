const Role = require( '../model/role' );
const User = require( '../model/user' );
const Section = require( '../model/section' );
const Product = require( '../model/product' );

const validateRole = async ( role = '' ) => {
    const roleVerification = await Role.findOne( { role } );
    if( !roleVerification ) throw new Error( `Role ${ role } does not exist in the DB` );
};

const isUniqueEmail = async ( email = '' ) => {
    const emailInDB = await User.findOne( { email } );
    if( emailInDB ) throw new Error( `Email: ${ email } is already registered` );
};

const isIdOnDataBase = async ( id ) => {
    const flag = await User.findById( id );
    if( !flag ) throw new Error( `There is not an user with ID: ${ id }` );
};

const isSectionOnDataBase = async ( id ) => {
    const flag = await Section.findById( id );
    if( !flag ) throw new Error( `There is not a section with ID: ${ id }` );
};

const isNameSectionOnDataBase = async ( name = '' ) => {
    name = name.toUpperCase();
    const flag = await Section.findOne( { name } );
    if( flag ) throw new Error( `Section ${ name } is already in the DB` )
};

const isProductByID = async ( id ) => {
    const flag = await Product.findById( id );
    if( !flag ) throw new Error( `There is not a product with ID: ${ id }` );
};

const isProductByName = async ( name = '' ) => {
    name = name.toUpperCase();
    const flag = await Product.findOne( { name } );
    if( flag ) throw new Error( `Product ${ name } is already in the DB` );
};

module.exports = {
    validateRole,
    isUniqueEmail,
    isIdOnDataBase,
    isSectionOnDataBase,
    isNameSectionOnDataBase,
    isProductByID,
    isProductByName
};
