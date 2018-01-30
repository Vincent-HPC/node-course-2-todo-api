// const MongoClient = require('mongodb').MongoClient;
const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // deleteMany
    // db.collection('Todos').deleteMany({
    //     text: 'Eat lunch'
    // }).then((result) => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({
    //     text: 'Eat lunch'
    // }).then((result) => {
    //     console.log(result);
    // });

    // findOneAndDelete
    // db.collection('Todos').findOneAndDelete({
    //     completed: false
    // }).then((result) => {
    //     console.log(result);
    // });

    // deleteMany - name: 'Vincent'
    db.collection('Users').deleteMany({
        name: 'Vincent'
    }).then((result) => {
        console.log(result);
    });

    // findOneAndDelete by id - target: Mike
    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('5a6f2c6ac21768d0baa94389')
    }).then((results) => {
        console.log(JSON.stringify(results, undefined, 2));
    });





    // db.close();
});
