const router = require('express').Router();


// Route User
router.use(require('./user'));

// Route Session
router.use(require('./session'));

// Route Todo
router.use(require('./todo'));


router.get('/', function(request, response) {

    response.redirect('/todos');

});



module.exports = router;