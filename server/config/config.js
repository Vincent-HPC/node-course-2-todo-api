var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    // when u require JSON file, it automatically parses it into a JS object
    // dont have to use anything like JSON.parse
    var config = require('./config.json');
    var envConfig = config[env];

    //This take a Object like envConfig, it gets all of the keys
    //and it returns them as an array
    // forEach -> loop an array of items
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
}

// if (env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }
