const expect = require('expect');
const request = require('supertest');

const {
    app
} = require('./../server');
const {
    Todo
} = require('./../models/todo');

// beforeEach will let us run some code before every single test case
// Use beforeEach to set up the database in a way that's useful
// make sure the database is empty right here
// Once called done,it's only going to move on the test case
// We can do something asynchronous inside of here
beforeEach((done) => {
    Todo.remove({}).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({
                text
            }) //This object will get converted to JSON by supertest,so there's no need for us to worry about
            .expect(200) //201
            .expect((res) => {
                expect(res.body.text).toBe(text); //text + 1
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                //Todo.find is really similar to the MongoDB native find method
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1); // 3
                    expect(todos[0].text).toBe(text);
                    done();
                    // if either of these fail the test is still going to pass
                    // but we have to do is tack on a catch call
                    // catch will get any errors that might occur inside of a callback
                }).catch((e) => done(e));
            }); //actually check what got stored in the MongoDB collection

    });

    //Verify that Todo doesn't get created when we send bad data
    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});
