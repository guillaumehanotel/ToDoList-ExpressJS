const router = require('express').Router();


// Route User
router.use(require('./user'));

// Route Session
router.use(require('./session'))


router.get('/', function(request, response) {

    response.format({
        html: () => { response.render('index.ejs') },
        json: () => { response.send("ok")}
    })

});



module.exports = router;