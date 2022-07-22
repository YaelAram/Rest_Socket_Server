const { Socket } = require( 'socket.io' );

const { validateJWT } = require( '../helpers/jwt' );
const Chat = require( '../model/chat' );
const TOKEN_NAME = 'auth_token';

const chat = new Chat();

/**
 * 
 * @param { Socket } socket 
 */
const socketController = async ( socket, io ) => {
    const auth_token = socket.handshake.headers[ TOKEN_NAME ];
    const user = await validateJWT( auth_token );
    if( !user ) return socket.disconnect();
    // User connected
    chat.connectUser( user );
    io.emit( 'active-users', chat.activeUsers );
    socket.join( user.id );
    socket.on( 'send-message', ( { uid, message }, callback ) => {
        chat.createMessage( user.id, uid, user.name, message );
        // socket.adapter.rooms.has(uid) False if the user is offline
        socket.to( uid ).emit( 'private-message', { from: user.id, alias: user.name, message } );
        callback( { from: user.name, message } );
    } );
    socket.on( 'ask-messages', ( { to }, callback ) => {
        callback( chat.lastFiveMessages( user.id, to ) );
    } );
    // Disconnect User
    socket.on( 'disconnect', () => {
        chat.disconnect( user._id );
        io.emit( 'active-users', chat.activeUsers );
    } );
};

module.exports = socketController;
