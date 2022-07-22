const { Router } = require( 'express' );
const { check } = require( 'express-validator' );

const checkFieldsForErrors = require('../middlewares/check_fields' );
const checkJWT = require( '../middlewares/check_jwt' );
const { checkRoleDelete } = require( '../middlewares/check_role' );

const { validateRole, isUniqueEmail, isIdOnDataBase } = require( '../database/db_validation' );

const router = Router();

const { 
    getRequest,
    postRequest,
    putRequest,
    deleteRequest 
} = require( '../controllers/server_routes_controller' );

router.get( '/', [
    check( 'startAt', 'startAt must be greater than 0' ).optional( { nullable: true } ).isInt( { gt: 0 } ),
    check( 'limit', 'limit must be greater than 0' ).optional( { nullable: true } ).isInt( { gt: 0 } ),
    checkFieldsForErrors
], getRequest );

router.post( '/', [
    check( 'name', 'Please, check the field name' ).isAlpha( 'en-US', { ignore: ' ' } ),
    check( 'email', 'Please, check the field email' ).isEmail(),
    check( 'email' ).custom( isUniqueEmail ),
    check( 'role' ).custom( validateRole ),
    check( 'password', 'Please, check the password enteres, minimun length: 8' ).isLength( { min: 8 } ),
    checkFieldsForErrors
], postRequest );

router.put( '/:id', [
    check( 'id', 'Please, check the ID provided (it is not a valid MondoDB ID)' ).isMongoId(),
    check( 'id' ).custom( isIdOnDataBase ),
    check( 'name', 'Please, check the field name' ).optional( { nullable: true } ).isAlpha( 'en-US', { ignore: ' ' } ),
    check( 'email', 'Please, check the field email' ).optional( { nullable: true } ).isEmail(),
    check( 'email' ).optional( { nullable: true } ).custom( isUniqueEmail ),
    check( 'role' ).optional( { nullable: true } ).custom( validateRole ),
    check( 'password', 'Please, check password minimun length: 8' ).optional( { nullable: true } ).isLength( { min: 8 } ),
    checkFieldsForErrors
], putRequest );

router.delete( '/:id', [
    checkJWT,
    checkRoleDelete,
    check( 'id', 'Please, check the ID provided (it is not a valid MondoDB ID)' ).isMongoId(),
    check( 'id' ).custom( isIdOnDataBase ),
    checkFieldsForErrors
], deleteRequest );

module.exports = router;
