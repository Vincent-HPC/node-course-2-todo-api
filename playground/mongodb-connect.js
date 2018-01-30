// const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');
// we can puu off any property from the MongoDB library
// In this case the only property we had was a mongo client
//up two line code are the same
//  ObjectID constructor function lets us make new obj. IDs

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // Insert new doc into Users (name, age, location)
    // db.collection('Users').insertOne({
    //     name: 'Vincent',
    //     age: 26,
    //     location: 'taiwan'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert Vincent', err);
    //     }
    //
    //     // console.log(JSON.stringify(result.ops, undefined, 2));
    //     // console.log(result.ops[0]._id);
    //     console.log(result.ops[0]._id.getTimestamp());
    // });


    db.close();
});




//
// output:
// $ node playground/mongodb-connect.js
// Connected to MongoDB server
// [
//  {
//    "name": "Vincent",
//    "age": 26,
//    "location": "taiwan",
//    "_id": "5a6f2c6ac21768d0baa94389"
//  }
// ]
