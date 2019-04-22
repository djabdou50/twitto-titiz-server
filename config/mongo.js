const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
import {config} from 'dotenv';

// const url = 'mongodb://eyetags:1980.azama@cluster0-shard-00-00-i61og.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';
// const url = 'mongodb://gqluser:pass@mongodb:27017/graphqldb';
// mongoose.connect(url, { useNewUrlParser: true });
// mongoose.connection.once('open', () => console.log(`Connected to mongo at ${url}`));
//node mongoose.connect( 'mongodb://gqluser:pass@mongodb:27017/graphqldb' , { useNewUrlParser: true });



let connectWithRetry = () => {

    mongoose.Promise = global.Promise;
    const urldb = `mongodb://${process.env.APP_MONGO_USER}:${process.env.APP_MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.APP_MONGO_DB}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`;
    mongoose.connect(urldb, {
        useNewUrlParser: true,
        reconnectTries: 10,
        reconnectInterval: 500,
    }).then(
        () => {
            console.log(`Connected to mongo at ${urldb}`)
        },
        err => {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec');
            setTimeout(connectWithRetry, 5000);
        }
    );

};
export default connectWithRetry();