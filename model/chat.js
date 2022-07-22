class Message{
    constructor( from, to, alias, message ){
        this.from = from;
        this.to = to;
        this.alias = alias;
        this.message = message;
    }
}

class Chat{
    constructor() {
        this.messages = [];
        this.users = {};
    }

    get activeUsers() {
        return Object.values( this.users );
    }

    lastFiveMessages( fromReq, toReq ) {
        return this.messages
            .filter( ( { from , to } ) => 
                ( ( fromReq === from ) && ( toReq === to ) ) || ( ( fromReq === to ) && ( toReq === from ) ) ) 
            .slice( 0, 5 )
            .map( ( { alias, message } ) => ( { 'from': alias, message } ) );
    }

    createMessage( from, to, alias, message ) {
        this.messages.push( new Message( from, to, alias, message ) );
    }

    connectUser( user ) {
        this.users[ user.id ] = user;
    }

    disconnect( id ) {
        delete this.users[ id ];
    }
}

module.exports = Chat;
