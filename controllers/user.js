const router = require('express').Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/User');


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


// ADD (view used to display the form for adding content)
router.get('/users/add', function (request, response) {
    response.render('users/edit.ejs'); // ou add.ejs
});


// CREATE (backend code that handles the Add form)
router.post('/users', function (request, response, next) {

    if (!checkEmptyFields(request.body)) {

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
                        response.redirect('/users')
                    },
                    json: () => {
                        response.send(rowUser)
                    }
                })
            });

        }, next);

    } else {

        response.format({
            html: () => {
                response.redirect('/users/add')
            },
            json: () => {
                response.send({"error" : "Please fill all fields"})
            }
        })

    }

});


// EDIT (view used to display the form for editing existing content)
router.get('/users/:userId/edit', function (request, response) {
    response.render('users/edit.ejs');
});


// UPDATE (backend code that handles the Edit form)
router.put('/users/:userId', function (request, response) {
    response.format({
        html: () => {
            response.redirect('/users')
        },
        json: () => {
            response.send("update ok")
        }
    })
});


// DELETE (backend code that handles the Delete form)
router.delete('/users/:userId', function (request, response) {
    response.format({
        html: () => {
            response.redirect('/users')
        },
        json: () => {
            response.send("delete ok")
        }
    })
});


function checkEmptyFields(fields) {
    for (let field in fields) {
        if (!field) {
            return true;
        }
    }
    return false;
}

module.exports = router;