const router = require('express').Router();
const User = require('../models/User');


// INDEX (lists the elements available for editing; also displays the delete form)
router.get('/users', function (request, response) {
    response.format({
        html: () => { response.render('users/index.ejs') },
        json: () => { response.send("show all ok")}
    })
});


// SHOW (one element)
router.get('/users/:userId', function (request, response) {
    response.format({
        html: () => { response.render('users/index.ejs') },
        json: () => { response.send("show ok")}
    })
});


// ADD (view used to display the form for adding content)
router.get('/users/add', function (request, response) {
    response.render('users/edit.ejs'); // ou add.ejs
});


// CREATE (backend code that handles the Add form)
router.post('/users', function (request, response) {
    response.format({
        html: () => { response.redirect('/users') },
        json: () => { response.send("create ok")}
    })
});


// EDIT (view used to display the form for editing existing content)
router.get('/users/:userId/edit', function (request, response) {
    response.render('users/edit.ejs');
});


// UPDATE (backend code that handles the Edit form)
router.put('/users/:userId', function (request, response) {
    response.format({
        html: () => { response.redirect('/users') },
        json: () => { response.send("update ok")}
    })
});


// DELETE (backend code that handles the Delete form)
router.delete('/users/:userId', function (request, response) {
    response.format({
        html: () => { response.redirect('/users') },
        json: () => { response.send("delete ok")}
    })
});


module.exports = router;