// const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');
// we can puu off any property from the MongoDB library
// In this case the only property we had was a mongo client
//up two line code are the same
//  ObjectID constructor function lets us make new obj. IDs


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    //toArray returns a promise
    // db.collection('Todos').find({
    //     // completed: false
    //     // _id: '5a6f2921b77862d05d2db6ff' <-this isn't work cuz _id is an obj.,not string
    //     _id: new ObjectID('5a6f35a4a6e118cfd92cd4e1')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({
        name: 'Vincent'
    }).toArray().then((docs) => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch users', err);
    });


    // db.close();
});
