const bcryptjs = require( 'bcryptjs' );

const encryptPassword = ( password = '' ) => bcryptjs.hashSync( password, bcryptjs.genSaltSync( 15 ) );

module.exports = encryptPassword;
