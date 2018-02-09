var {
    User
} = require('./../models/user');

// L91:
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) { //    valid token but query not find user
            return Promise.reject();
            // This will auto stop, and not run "res.send(user);" and run
            // error case -> catch(e)  to send back 401
        }

        // use this modified request to access
        // app.get('/users/me', authenticate, (req, res)
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();
    });
};

module.exports = {
    authenticate
};
