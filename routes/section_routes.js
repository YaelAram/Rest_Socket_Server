const { Router } = require( 'express' );
const { check } = require( 'express-validator' );

const checkJWT = require( '../middlewares/check_jwt' );
const checkFieldsForErrors = require('../middlewares/check_fields' );
const { checkRoleDelete } = require( '../middlewares/check_role' );
const { isSectionOnDataBase, isNameSectionOnDataBase } = require( '../database/db_validation' );

const {
    getSections,
    getSectionById,
    createSection,
    updateSection,
    deleteSection
} = require( '../controllers/section_routes_controller' );

const router = Router();

router.get( '/', [
    check( 'startAt', 'startAt must be greater than 0' ).optional( { nullable: true } ).isInt( { gt: 0 } ),
    check( 'limit', 'limit must be greater than 0' ).optional( { nullable: true } ).isInt( { gt: 0 } ),
    checkFieldsForErrors
], getSections );

router.get( '/:id', [
    check( 'id', 'Id field has an invalid Mongo ID format' ).isMongoId(),
    check( 'id' ).custom( isSectionOnDataBase ),
    checkFieldsForErrors
], getSectionById );

router.post( '/', [
    checkJWT,
    check( 'name', 'Name field is required' ).notEmpty(),
    check( 'name', 'Numeric cheracters are not allowed' ).isAlpha( 'en-US', {ignore: ' '} ),
    check( 'name', 'The name entered is already in the database' ).custom( isNameSectionOnDataBase ),
    checkFieldsForErrors
], createSection );

router.put( '/:id', [
    checkJWT,
    check( 'id', 'Id field has an invalid Mongo ID format' ).isMongoId(),
    check( 'id' ).custom( isSectionOnDataBase ),
    check( 'name', 'Name field is required' ).notEmpty(),
    check( 'name', 'Numeric cheracters are not allowed' ).isAlpha( 'en-US', {ignore: ' '} ),
    check( 'name', 'The name entered is already in the database' ).custom( isNameSectionOnDataBase ),
    checkFieldsForErrors
], updateSection );

router.delete( '/:id', [
    checkJWT,
    checkRoleDelete,
    check( 'id', 'Id field has an invalid Mongo ID format' ).isMongoId(),
    check( 'id' ).custom( isSectionOnDataBase ),
    checkFieldsForErrors
], deleteSection );

module.exports = router;
