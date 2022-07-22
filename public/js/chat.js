const messageField = document.querySelector( '.message' );
const userName = document.querySelector( '#user_name' );
const chatSection = document.querySelector( '.chat_messages' );
const activeUsersSection = document.querySelector( '.active_users_list' );

let user = {};
let socket = null;
let uid = null;
const TOKEN_NAME = 'auth_token';

const showMessage = ( { from, message } ) => {
    const p = document.createElement( 'p' );
    p.classList.add( 'user_message' );
    p.innerHTML = `<span class="from">${ from }: </span> ${ message }`;
    chatSection.append( p );
};

const notifyNewMessage = ( { from, alias, message } ) => {
    if( from === uid ) showMessage( { from:alias, message} );
    else{
        for( let i = 0 ; i < activeUsersSection.children.length ; i++ ){
            const element = activeUsersSection.children[ i ];
            if( from === element.dataset.uid ){
                element.innerText += ' => New Message';
                break;
            }
        }
    }
};

const selectRoom = ( evt ) => {
    const h4 = evt.target;
    uid = h4.dataset.uid;
    h4.innerText = h4.innerText.split( '=>' ).shift();
    userName.innerText = h4.innerText;
    socket.emit( 'ask-messages', { to: uid }, ( messages = [] ) => {
        chatSection.innerHTML = '';
        if( messages.length ) messages.forEach( showMessage );
    } );
};

const showUsers = ( payload = [] ) => {
    payload.splice( payload.findIndex( ( { uid } ) => uid === user.uid ), 1 );
    for( let i = 0 ; i < activeUsersSection.children.length ; i++ ){
        const element = activeUsersSection.children[ i ];
        const index = payload.findIndex( ( { uid } ) => uid === element.dataset.uid );
        if( index === -1 ) element.remove();
        else payload.splice( index, 1 );
    }
    payload.forEach( ( { uid, name } ) => {
        const h4 = document.createElement( 'h4' );
        h4.classList.add( 'userItem' );
        h4.setAttribute( 'data-uid', uid );
        h4.innerText = name;
        h4.addEventListener( 'click', selectRoom );
        activeUsersSection.append( h4 );
    } );
};

const connectSocket = async () => {
    socket = io( {
        'extraHeaders': { 'auth_token': localStorage.getItem( TOKEN_NAME ) }
    } );
    socket.on( 'active-users', showUsers );
    socket.on( 'private-message', notifyNewMessage );
};

const validateJWT = async () => {
    const auth_token = localStorage.getItem( TOKEN_NAME ) ?? '';
    if( !auth_token ) window.location = 'index.html';

    const resp = await fetch( 'http://192.168.1.112:8080/api/auth/', {
        method: 'GET',
        headers: { auth_token },
    } );
    const data = await resp.json();
    if( !resp.ok && ( data.errors || data.message ) ){
        window.location = 'index.html';
        throw new Error( 'The JWT stored is not valid' );
    }
    else{
        localStorage.setItem( 'auth_token', data.token );
        user = { uid: data.uid, name: data.name, email: data.email };
        document.title = user.name;
        document.querySelector( 'p' ).innerText = `Welcome ${ user.name }`;
    }

    await connectSocket();
};

const main = async () => {
    await validateJWT();
};

const sendMessage = () => {
    const message = messageField.value.trim();
    if( message.length && uid ){
        socket.emit( 'send-message', { uid, message }, showMessage );
        messageField.value = '';
    }
};

messageField.addEventListener( 'keyup', ( { keyCode } ) => {
    if( keyCode === 13 ) sendMessage();
} );
document.querySelector( '.send_button' ).addEventListener( 'click', sendMessage );

main();
