const {
    SHA256
} = require('crypto-js');
const jwt = require('jsonwebToken');

var data = {
    id: 10
};

// This is the value we will send back to the user
// when they either sign up or log in
// It's also the value we will store inside of that
// tokens array( user.js ) "access" and "token" we just generate
var token = jwt.sign(data, '123abc');
console.log(token);

// token + '1' or 123abcc  --> Only when the token is unaltered and
// the secret is the same as the one used to create the token  are we
// will get the data back and this is exactly what we want.
var decoded = jwt.verify(token, '123abc'); //pass the token we want verify and the same secret
console.log('decode', decoded);



// ** "JWT" can do it easily, so not need downbelow code
// var message = 'I am user number 3';
// var hash = SHA256(message).toString(); //SHA256 will return an Object
//
// console.log(`Message: ${message}`);
// console.log(`hash: ${hash}`);
//
// var data = {
//     id: 4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
//     add "somesecret" to salt the hash -> unique hash~~
// }
//
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust!');
// }
