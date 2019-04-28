import Cron from 'cron';
import deepAI from '../apis/deepai';
import Tweet from '../model/tweet';
import addQueue from '../config/beeQueue'

addQueue.process(async (job) => {
    console.log(`Processing job id ${job.id} data media ${job.data.media}`);

    return new Tweet(job.data).save();
    // return job.data.media;
});

let deepAIanalyse = async (url) => {

    const deepAIs = new deepAI();
    deepAIs.initialize({});

    return await deepAIs.analyse(url).then( data => {
        return data;
    })

};

let AIJob = async (url) => {
    //https://pbs.twimg.com/media/D4dJMn1U4AEM-Qa.jpg
    // deepAIanalyse("https://pbs.twimg.com/media/D4hrSiUWAAABOW1.jpg")
    //     .then( data => {
    //     console.log("deep ai data ")
    //     console.log(data.output.faces)
    // })

    // findTweets('selfie').then( tweets => {
    //
    //     tweets.forEach( tweet => {
    //         const job = addQueue.createJob(tweet).timeout(10000).retries(2).save().then((job) => {
    //             console.log("created job id", job.id)
    //         });
    //     })
    //
    //
    // });

};

export default AIJob();