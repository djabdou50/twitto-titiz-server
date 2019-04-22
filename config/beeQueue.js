import Queue from 'bee-queue';
require('dotenv').config();


const addQueue = new Queue('findTweets', {
    redis: {
        url: process.env.REDIS_URL,
        password: process.env.REDIS_PASSWORD,
        db: 0,
        removeOnSuccess: false,
    },
    // isWorker: false
});

export default addQueue;