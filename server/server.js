var express = require('express');
var bodyParser = require('body-parser');

var {
    mongoose
} = require('./db/mongoose');
var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
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
