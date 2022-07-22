const express = require( 'express' );
const cors = require( 'cors' );
const fileUpload = require( 'express-fileupload' );
const { conectToDataBase } = require('../database/config');

const socketController = require( '../socket/controller' );

class Server{
    constructor(){
        this.app = express();
        this.PORT = process.env.PORT;
        this.server = require( 'http' ).createServer( this.app );
        this.io = require( 'socket.io' )( this.server );

        //Routes
        this.authPath = '/api/auth';
        this.routesPath = '/api/request';
        this.searchPath = '/api/search';
        this.sectionPath = '/api/section';
        this.productPath = '/api/product';

        // Database Connection
        this.conectDB();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();

        // Socket Server
        this.socket();

        // Start Server
        this.listen()
    }

    async conectDB(){
        conectToDataBase();
    }

    middlewares(){
        // CORS
        this.app.use( cors() );

        // Body read ( get data for any request )
        this.app.use( express.json() );

        // Public Directory
        this.app.use( express.static( 'public' ) );

        // File Upload
        this.app.use( fileUpload( {
            useTempFiles: true,
            tempFileDir: '/tmp/'
        } ) );
    }

    routes(){
        this.app.use( this.authPath, require( '../routes/auth_routes' ) );
        this.app.use( this.productPath, require( '../routes/product_routes' ) );
        this.app.use( this.routesPath, require( '../routes/server_routes' ) );
        this.app.use( this.searchPath, require( '../routes/search_routes' ) );
        this.app.use( this.sectionPath, require( '../routes/section_routes' ) );
    }

    socket(){
        this.io.on( 'connection', ( socket ) => socketController( socket, this.io ) );
    }

    listen(){
        this.server.listen( this.PORT, () => console.log( `Listening at port ${ this.PORT }` ) );
    }
};

module.exports = Server;
