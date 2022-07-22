const { Router } = require( 'express' );
const { check } = require( 'express-validator' );

const checkFieldsForErrors = require('../middlewares/check_fields' );
const checkJWT = require( '../middlewares/check_jwt' );
const { checkRoleDelete } = require( '../middlewares/check_role' );

const { isProductByName, isProductByID } = require( '../database/db_validation' );

const {
    getProducts,
    getProductByID,
    createProduct,
    updateProduct,
    deleteProduct
} = require( '../controllers/product_routes_controller' );

const router = Router();

router.get( '/', [
    check( 'startAt', 'startAt must be greater than 0' ).optional( { nullable: true } ).isInt( { gt: 0 } ),
    check( 'limit', 'limit must be greater than 0' ).optional( { nullable: true } ).isInt( { gt: 0 } ),
    checkFieldsForErrors
], getProducts );

router.get( '/:id', [
    check( 'id', 'Invalid format for a Mongo ID' ).isMongoId(),
    checkFieldsForErrors
], getProductByID );

router.post( '/', [
    checkJWT,
    check( 'name', 'Name field is required' ).notEmpty(),
    check( 'name', 'Numeric characters are not allowed' ).isAlpha( 'en-US', { ignore: ' ' } ),
    check( 'name' ).custom( isProductByName ),
    check( 'description', 'Descripton field is required' ).notEmpty(),
    check( 'section_name', 'Name field is required' ).notEmpty(),
    check( 'section_name', 'Numeric cheracters are not allowed' ).isAlpha( 'en-US', { ignore: ' ' } ),
    checkFieldsForErrors
], createProduct );

router.put( '/:id', [
    checkJWT,
    check( 'id', 'Invalid format for a Mongo ID' ).isMongoId(),
    check( 'id' ).custom( isProductByID ),
    check( 'name', 'Name field is required' ).optional( { nullable: true } ).notEmpty(),
    check( 'name', 'Numeric characters are not allowed' ).optional( { nullable: true } ).isAlpha( 'en-US', { ignore: ' ' } ),
    check( 'name' ).optional( { nullable: true } ).custom( isProductByName ),
    check( 'description', 'Descripton field is required' ).optional( { nullable: true } ).notEmpty(),
    check( 'section_name', 'Name field is required' ).optional( { nullable: true } ).notEmpty(),
    check( 'section_name', 'Numeric cheracters are not allowed' ).optional( { nullable: true } ).isAlpha( 'en-US', { ignore: ' ' } ),
    checkFieldsForErrors
], updateProduct );

router.delete( '/:id', [
    checkJWT,
    checkRoleDelete,
    check( 'id', 'Invalid format for a Mongo ID' ).isMongoId(),
    check( 'id' ).custom( isProductByID ),
    checkFieldsForErrors
], deleteProduct );

module.exports = router;
