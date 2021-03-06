require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {
    ObjectID
} = require('mongodb');

var {
    mongoose
} = require('./db/mongoose');
var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');
var {
    authenticate
} = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({
            // create an object setting to Todo array Using ES6
            // so that u arent lock urself and can add on another property
            // make more flexible future
            todos
        });
    }, (e) => {
        res.status(400).send(e);
    });
});


// challenge GET /todos/1234324
app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    // Valid id using isValid
    // // 404 - send back empty send
    if (!ObjectID.isValid(id)) {
        // res.status(404);
        // return res.send();
        return res.status(404).send();
    }

    // findById
    // // success
    // // // if todo - send it back
    // // // if no todo - send back 404 with empty body
    // // error
    // // // 400 - send empty body back

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        // res.send(todo);
        res.send({
            todo
        });
        // Instead of sending back todo with the array as the body
        // here send back an Object where the todo is attached as
        // the todo property using ES6 obj.
        // it's more flexible to add properties onto the response
    }).catch((e) => {
        res.status(400).send();
    });

    // }, (e) => {
    //     res.status(400);
    //     res.send();
    // });

    // what diff between up above two case?!
    // catch(e) or (e) =>{}
});


app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    // findByIdAndRemove -> findByOneAndRemove, so can custom query
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch((e) => {
        res.status(400).send();
    });

});

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    // We dont need users updating ids or adding any other
    // properties that aren't specified in the mongoose model.
    // This has a subset of the things the user passed to us.
    // We don't want user to able to update anything they choose.
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    //This if statement checking if the completed property is a
    //boolean and it's on body
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime(); //This is the number of milliseconds since midnight on 1/1/1970
    } else {
        body.completed = false;
        //When u want to remove a value from the database u can simply set it to null
        body.completedAt = null;
    }

    // findOneAndUpdate
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ // send back as the todo property where todo equals
            todo // the todo variable using the ES6 syntax
        });
    }).catch((e) => {
        res.status(400).send();
    })

});


app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    // *** There's no reason to pass in an object that we create
    // when we already have the object we need ***
    // var user = new User({
    //     email: body.email,
    //     password: body.password
    // });

    // // It's a custom model  method we're going to create
    // User.findByToken
    // // This method will be responsible for adding a token on it to the
    // // individual user document saving that and returning the token
    // // instance method
    // user.generateAuthToken

    // user.save().then((user) <== the user variable which was the arg. to then
    // that we sent back isn't the same as the user variable defined here
    // but this value is identical to the one up here
    // they're the same excat thing in memory which means we can simply remove the arg.
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user); //custom header that http not support by default
    }).catch((e) => {
        res.status(400).send(e);
    })
});

// L91:
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// L95:
app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        // This return will keep the chain alive so if we do run into any errors
        // inside of the callback, the 400 will be used as the response
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => { //The promise will automatically trigger catch case
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => { // things dont go well, send 400 back
        res.status(400).send();
    })
});



app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {
    app
};


// var mongoose = require('mongoose');
//
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/TodoApp');

// up codes has cut to 'mongoose.js'


// mongoose make it more organize, create a mongoose model
// First argument: String model name
// Second argument will be an object to define the various properties
// var Todo = mongoose.model('Todo', {
//     text: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// });

// up codes has cut to 'todo.js'

//** var newTodo = new Todo() <= call the constructor function **
//** create a new instant **

// var newTodo = new Todo({
//     text: 'Cook dinner'
// });
//
//
//** Creating a new instance alone dosen't actually update **
//** the MongoDB database,so call save(),and save() returns a promise **
//
//
// newTodo.save().then((doc) => {
//     console.log('Save todo', doc);
// }, (e) => {
//     console.log('Unable to save todo');
// });

// var otherTodo = new Todo({
//     text: 'Feed the cat',
//     completed: true,
//     completedAt: 123
// });

//
// var otherTodo = new Todo({
//     text: ' Something to do  '
// });
//
// otherTodo.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save', e);
// });


// Users
// email - reuqire it - trim it - set type - set min length of 1
// var User = mongoose.model('User', {
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 1
//     }
// });

// up codes has cut to 'user.js'


//
// var user = new User({
//     email: 'andrew@example.com     '
// });
//
// user.save().then((doc) => {
//     console.log('User save', doc);
// }, (e) => {
//     console.log('Unable to save user', e);
// });




// var otherTodo = new Todo({});
// ** This output:  **
// {
//   "__v": 0,
//   "_id": "5a70cb2142f641a2f4ca58b3"
// }
// ** This output:  **
