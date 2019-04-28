const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
import {config} from 'dotenv';


let connectWithRetry = () => {

    mongoose.Promise = global.Promise;
    const urldb = `mongodb://${process.env.APP_MONGO_USER}:${process.env.APP_MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.APP_MONGO_DB}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`;
    mongoose.connect(urldb, {
        useNewUrlParser: true,
        reconnectTries: 10,
        reconnectInterval: 500,
        useCreateIndex: true,
    }).then(
        () => {
            console.log(`Connected to mongo at ${urldb}`)
        },
        err => {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec');
            setTimeout(connectWithRetry, 5000);
        }
    );

    mongoose.set('debug', true);

};
export default connectWithRetry();