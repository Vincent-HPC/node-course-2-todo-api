const {
    ObjectID
} = require('mongodb');

const {
    mongoose
} = require('./../server/db/mongoose');
const {
    Todo
} = require('./../server/models/todo');
const {
    User
} = require('./../server/models/user');

// diff to find, the REMOVE doc is that u cant' pass a
// empty argument and expect all the documents to get removed.
// ex: odo.remove()

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// This will match very first documents only it's
// going to remove it. And this will return the data
// which is removed from the database
// Todo.findOneAndRemove


Todo.findOneAndRemove({
    _id: '5a726291a6e118cfd92d0c5e'
}).then((todo) => {

});


// the callback will get the documents back
Todo.findByIdAndRemove('5a726291a6e118cfd92d0c5e').then((todo) => {
    console.log(todo);
});
