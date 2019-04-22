import Cron from 'cron';
import authTwitter from '../apis/twitter';
import Tweet from '../model/tweet';
import addQueue from '../config/beeQueue'



const CronJob = Cron.CronJob;
new CronJob('*/10 * * * * *', function() {
    // console.log('You will see this message every 10 second');

}, null, true, 'America/Los_Angeles');



let findTweets = async (keyword) => {

    const twitter = new authTwitter();
    let tw = twitter.initialize({});

    return await twitter.postSearch(keyword).then( results => {
        let tweets = [];
        results.statuses.map( result => {
            let media;
            try {
                media = result.entities.media[0].media_url_https;
            }catch (e) {}
            if( media !== undefined ){
                let tweet =  {
                    id: result.id,
                    created_at: result.created_at,
                    text: result.text,
                    media: media,
                    userid: result.user.id,
                    username: result.user.name,
                    screen_name: result.user.screen_name,
                }
                tweets.push(tweet);
            }
        });
        return tweets;
    });

};



let job = async (action) => {

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

export default job();

