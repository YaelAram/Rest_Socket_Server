const email = document.querySelector( '#email_field' );
const password = document.querySelector( '#password_field' );

function handleCredentialResponse( response ) {
    const body = { 'id_token': response.credential };
    fetch( 'http://192.168.1.112:8080/api/auth/google', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( body )
    } )
    .then( resp => resp.json() )
    .then( ( { email, token } ) => {
        localStorage.setItem( 'email', email );
        localStorage.setItem( 'auth_token', token );
        window.location = 'chat.html';
    } )
    .catch( console.warn );
}

const signOutFunction = () => {
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke( localStorage.getItem( 'email' ), ( done ) => {
        localStorage.clear();
        location.reload();
    } );
};

const logIn = async ( evt ) => {
    evt.preventDefault();
    const body = { email: email.value, password: password.value };
    const resp = await fetch( 'http://192.168.1.112:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( body )
    } );
    const data = await resp.json();
    if( !resp.ok && data.errors ){
        for( const { msg } of data.errors ) console.error( msg ); 
    }
    else if( !resp.ok && data.message ) console.error( data.message );
    else{
        console.log( 'LogIn successfully' );
        localStorage.setItem( 'auth_token', data.token );
        window.location = 'chat.html';
    }
};

const existsSession = () => {
    if( localStorage.getItem( 'auth_token' ) ) window.location = 'chat.html';
};

existsSession();

document.querySelector( '.sign_out_google' ).addEventListener( 'click', signOutFunction );
document.querySelector( 'form' ).addEventListener( 'submit', logIn );
