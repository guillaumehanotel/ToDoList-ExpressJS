const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');
const helper = require('../helpers/helper');


// INDEX (lists the elements available for editing; also displays the delete form)
router.get('/users', function (request, response) {

    User.findAll(function (userRows) {

        let users = userRows.map((row) => new User(row));

        response.format({
            html: () => {
                response.render('users/index.ejs', {users: users})
            },
            json: () => {
                response.send(userRows)
            }
        })
    });

});


// ADD (view used to display the form for adding content)
router.get('/users/add', function (request, response) {
    response.render('users/edit.ejs', {
        title: "Create User",
        user: {},
        action: "/users"
    }); // ou add.ejs
});


// SHOW (one element)
router.get('/users/:userId', function (request, response, next) {

    let userId = request.params.userId;

    if (!isNaN(userId)) {

        User.find(userId, function (rowUser) {

            if(!rowUser){
                next(new Error("No User with ID : " + userId + ""))
            }

            let user = new User(rowUser);

            response.format({
                html: () => {
                    response.render('users/show.ejs', {user: user})
                },
                json: () => {
                    response.send(rowUser)
                }
            })

        }, next);

    } else {
        next(new Error("Invalid ID : '" + userId + "'"))
    }
});


// CREATE (backend code that handles the Add form)
router.post('/users', function (request, response, next) {

    if (!helper.checkEmptyFields(request.body)) {

        let user_data = [
            request.body.pseudo,
            bcrypt.hashSync(request.body.password, saltRounds),
            request.body.email,
            request.body.firstname,
            request.body.lastname
        ];

        User.create(user_data, function (lastID) {

            User.find(lastID, function (rowUser) {
                response.format({
                    html: () => {
                        request.flash('success', "User created");
                        response.redirect('/users')
                    },
                    json: () => {
                        response.send(rowUser)
                    }
                })
            }, next);

        }, next);

    } else {

        response.format({
            html: () => {
                request.flash('error', "Please fill all fields");
                response.redirect(303, '/users/add')
            },
            json: () => {
                response.send({"error" : "Please fill all fields"})
            }
        })

    }

});


// EDIT (view used to display the form for editing existing content)
router.get('/users/:userId/edit', function (request, response, next) {

    let userId = request.params.userId;

    if (!isNaN(userId)) {
        User.find(userId, function (rowUser) {

            let user = new User(rowUser);

            response.render('users/edit.ejs', {
                title: "Update User",
                user: user,
                action: "/users/" + userId + "?_method=put"
            });

        }, next);
    } else {
        next(new Error("Invalid ID : '" + userId + "'"))
    }
});


// UPDATE (backend code that handles the Edit form)
router.put('/users/:userId', function (request, response, next) {

    let userId = request.params.userId;

    if (!isNaN(userId)) {
        if (!helper.checkEmptyFields(request.body)) {

            let user_data = [
                request.body.pseudo,
                bcrypt.hashSync(request.body.password, saltRounds),
                request.body.email,
                request.body.firstname,
                request.body.lastname
            ];

            User.update(userId, user_data, function () {

                User.find(userId, function (rowUser) {

                    response.format({
                        html: () => {
                            request.flash('success', "User edited");
                            response.redirect("/users")
                        },
                        json: () => {
                            response.send(rowUser);
                        }
                    })

                }, next);
            }, next);

        } else {
            response.format({
                html: () => {
                    request.flash('error', "Veuillez remplir tous les champs");
                    response.redirect(303, '/users/'+ userId +'/edit')
                },
                json: () => {
                    response.send({"error" : "Please fill all fields"})
                }
            })
        }

    } else {
        next(new Error("Invalid ID : '" + userId + "'"))
    }

});


// DELETE (backend code that handles the Delete form)
router.delete('/users/:userId', function (request, response, next) {

    let userId = request.params.userId;

    if (!isNaN(userId)) {

        User.delete(userId, function () {
            response.format({
                html: () => {
                    request.flash('success', "User deleted");
                    response.redirect("/users")
                },
                json: () => {
                    response.status(204).end();
                }
            })
        }, next);

    } else {
        next(new Error("Invalid ID : '" + userId + "'"))
    }

});



module.exports = router;
