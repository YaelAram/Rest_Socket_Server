const jwt = require( 'jsonwebtoken' );
const User = require( '../model/user' );

const createJWT = ( uid = '' ) => {
    return new Promise( ( resolve, reject ) => {
        const payload = { uid };
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4d'
        }, ( error, token ) => {
            if( error ){
                console.log( error );
                reject( 'JWT was not created' );
            }
            else resolve( token );
        } );
    } );
};

const validateJWT = async ( token = '' ) => {
    try{
        if( !token ) return null;
        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );
        const user = await User.findById( uid );
        if( !user ) return null;
        if( !user.state ) return null;
        return user;
    }
    catch( error ){
        console.error( error );
        return null;
    }
};

module.exports = {
    createJWT, 
    validateJWT
};
