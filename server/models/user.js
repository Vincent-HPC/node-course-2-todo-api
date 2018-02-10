const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebToken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


// Schema constructor function it take an object and
// on that object we define all of the attributes
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            // validator: (value) => {
            //     return validator.isEmail(value);
            // },
            //
            // This will get passed the value and it will return true or false
            // There is no reason to define a custom function,the method will
            // work on its own
            validator: validator.isEmail,
            message: '{VALUE} is not a valid emal'
            //{VALUE} is the validator package doc. write!!!
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// @Override the function toJSON which is default options method
UserSchema.methods.toJSON = function() {
    var user = this;
    //.toObject() let mongoose variable "user" converting it into a regular object
    // where only the properties avaialble on the doc. exist.
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};


// UserSchema.method is an object and on this object we can add
// any method we like, these will be your instance methods.
// Not user arrow function cuz it not bind "This" keyword
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        // 1st arg is the object that has the data we want to sign
        // 2nd arg is some secret value eventually will take this secret value
        // out of our code and move it into a config. variable
        _id: user._id.toHexString(),
        access
    }, 'abc123').toString();

    user.tokens.push({
        access,
        token
    });

    // user.save return a promise,we can call .then()
    // In the server file we can grab the token by tacking on
    // and then call back getting access to the token and then
    // responding inside of the callback function
    // In order to allow Server.js chain onto the Promise
    // we will return it right here.

    // return user.save().then(() => {
    //     return token;
    // }).then((token) => {
    //
    // })

    // In this case,just returing a value and that is legal
    // That value will get passed as the success argument for the next then call
    return user.save().then(() => {
        return token;
    });
};

UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        return Promise.reject(); // the same above
    }

    // This will return a promise and return that in order to add some chaining.
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

// L95
UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({
        email
    }).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// We can't add method onto user
var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};
