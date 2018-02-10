const expect = require('expect');
const request = require('supertest');
const {
    ObjectID
} = require('mongodb');

const {
    app
} = require('./../server');
const {
    Todo
} = require('./../models/todo');
const {
    User
} = require('./../models/user');
const {
    todos,
    populateTodos,
    users,
    populateUsers
} = require('./seed/seed');



// beforeEach will let us run some code before every single test case
// Use beforeEach to set up the database in a way that's useful
// make sure the database is empty right here
// Once called done,it's only going to move on the test case
// We can do something asynchronous inside of here

// Down below only for testing POST
// **************************************** //
// beforeEach((done) => {
//     Todo.remove({}).then(() => done());
// });
// **************************************** //


beforeEach(populateUsers);
// Down below for testing GET, so need insert to db
// **************************************** //
beforeEach(populateTodos);
// **************************************** //



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
                Todo.find({
                    text
                }).then((todos) => {
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
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
        // cuz not doing anything synchronous here,
        // so no need to provide a function to end like above
    });
});


describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        // make sure you get a 404 back
        var hexId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        // /todos/123
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {

    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`) //trigger HTTP request
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                // query database using findById toNotExist
                // expect(null).toNotExist();
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    });
});

describe('PATH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString(); // grab id of first item

        var text = 'This should be the new text';
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                'completed': true,
                text // update text, set completed true
            })
            .expect(200) // 200
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);


        // ***********
        // .expect((res) => {
        //     console.log("!!!", res.body.todo.text);
        //     expect(res.body.todo.text).toBe(text);
        // })
        // .end((err, res) => {
        //     if (err) {
        //         return done(err);
        //     }
        //
        //     Todo.findById(hexId).then((todo) => {
        //         expect(todos[0].text).toBe(text);
        //         expect(todos[0].completed).toBe(true);
        //         expect(todos[0].completedAt).toBeA('number');
        //         done();
        //     }).catch((e) => done(e));
        // });
        // verify :text is changed, completed is true, completedAt is a number .toBeA

    });

    it('should clear completedAt when todo is not completed', (done) => {
        // grab id of second item
        var hexId = todos[1]._id.toHexString();

        var text = "This should be the new text : 2";
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                "completed": false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
        // update text, set completed to false
        // 200
        // text is changed, completed false, completedAt is null .toNotExist
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                // two assertions that make user when we provide
                // a valid token ,we get valid data back
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        // require a unique valid email and a password
        var email = 'example@example.com';
        var password = '123mnb';

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                //expect that the response headers object has a header called x-auth
                // use the bracket notation as opposed to the dot notation
                // cuz "x'-'auth" invalid using dot notaion
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }

                User.findOne({
                    email
                }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                });
            });
    });

    it('should return validation errors if request invalid', (done) => {
        // send across an invalid email and an invalid password, get 400

        request(app)
            .post('/users')
            .send({
                email: 'exampleerror',
                password: '12345'
            })
            .expect(400)
            .end(done);
    });

    it('should not create user if email in use', (done) => {
        // use an email that's already taken
        // try to sign up using one of the emails that in seed data
        // and a valid password, get 400

        request(app)
            .post('/users')
            .send({
                email: users[1].email,
                password: 'Password123!'
            })
            .expect(400)
            .end(done);
    });
});
