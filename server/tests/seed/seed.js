// todos, populateTodos defined over in the seed file as opposed to the server file

const {
    ObjectID
} = require('mongodb');
const jwt = require('jsonwebToken');

const {
    Todo
} = require('./../../models/todo');
const {
    User
} = require('./../../models/user');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userOneId,
            access: 'auth'
        }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoId,
    email: 'jen@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userTwoId,
            access: 'auth'
        }, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        // "Promise.all" takes an array of promises,
        // this callback( then() ) won't get fired until all of those promise resolve
        // Promise.all([userOne, userTwo]).then(() => {
        //
        // })
        return Promise.all([userOne, userTwo])
    }).then(() => done()); // call done wrapping up the  populateTodos middleware function
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
};
