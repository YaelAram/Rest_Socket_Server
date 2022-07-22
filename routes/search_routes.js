const { Router } = require( 'express' );

const { search } = require( '../controllers/search_routes_controller' );

const router = Router();

router.get( '/:collection/:attribute', [], search );

module.exports = router;
