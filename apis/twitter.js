const { RESTDataSource } = require('apollo-datasource-rest');
require('dotenv').config();
const mongoose = require('mongoose');
import authData from '../model/auth';
import Twit from 'twit';
import {pubsub} from '../graphql/resolvers';
import addQueue from '../config/beeQueue'


const TWEET_ADDED = 'TWEET_ADDED';
const TWEETS_ADDED = 'TWEETS_ADDED';


export default class Twitter extends RESTDataSource {
    constructor() {
        super();

        this.key = process.env.TWITTER_CONSUMER_KEY;
        this.secret = process.env.TWITTER_CONSUMER_SECRET;
        this.baseURL = 'https://api.twitter.com/';
        this.credentials = new Buffer( this.key +":"+ this.secret ).toString('base64');
        this.bearer = this.getbearer();//.then( data => { return data });
        this.T = new Twit({
            consumer_key:         process.env.TWITTER_CONSUMER_KEY,
            consumer_secret:      process.env.TWITTER_CONSUMER_SECRET,
            access_token:         process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret:  process.env.TWITTER_ACCESS_SECRET,
        })

    }


    async willSendRequest(request) {
        if(request.path === "oauth2/token"){
            request.headers.set('Authorization', "Basic " + this.credentials);
            request.headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }

        let bearer = await this.bearer.then(data => {return data})
        request.headers.set('Authorization', "Bearer "+ bearer );
        request.headers.set('Content-Type', 'application/json');

    }

    async generateBearer(){

        let bearer =  this.post(
            `oauth2/token`, // path
            `grant_type=client_credentials`, // request body
        ).then( data => {
            this.bearerToken = data.access_token;
            let token = new authData({ token : data.access_token, service: "twitter" }).save();
            return "access_token created";
        });

        // console.log(await bearer)
        return bearer;
    }

    async getbearer(){
        return await authData.find({ service: 'twitter' }).exec().then( data => {
            return data[0].token;
        })
    }

    async postStatus(status){
        console.log("teweet", status)
        // return await this.T.post('statuses/update', { status: "test hello ww" }, function(err, data, response) {
        //     console.log(err, data, response)
        // })
        return status;
    }

    async getStream(Keyword, action){

        console.log(Keyword)

        let keyword = (Keyword === undefined)? "selfie": Keyword;
        let stream = this.T.stream('statuses/filter', { track: [Keyword] });

        stream.on('tweet', function (tweet) {
            // console.log(tweet.user.screen_name)

            let media;

            try {
                media = tweet.entities.media[0].media_url_https;
            }catch (e) {}

            let retweet = tweet.text.indexOf("RT @");
            console.log('\x1b[34m%s\x1b[0m: ', "Twitter", retweet +' '+ tweet.text )

            let singletweet = {
                id: tweet.id,
                text: tweet.text,
                user: tweet.user.screen_name,
                media: media,
                created_at: tweet.created_at,
                userid: tweet.user.id,
                username: tweet.user.name,
                screen_name: tweet.user.screen_name,
            };

            // publish to grapql
            pubsub.publish(TWEETS_ADDED, { getTweets: singletweet } );

            if(media && retweet === -1 ){
                // console.log('\x1b[31m%s\x1b[0m: ',tweet.text)

                //dispatch a job to ML
                const job = addQueue.createJob(singletweet).timeout(100000).retries(1).save().then((job) => {
                    console.log("created job id", job.id)
                });
            }


        });


        if(action === "STOP"){
                stream.stop();
        }


        // return "mutation " + keyword;
    }

    async stopStream(){
        // this.context.stream.stop();
        console.log(this.T.stop())

    }



    // making an HTTP GET request
    async postSearch(tweet) {
        return this.get(
            `/1.1/search/tweets.json`, // path
            `q=${tweet} -RT -@ filter:twimg&result_type=recent&include_entities=true&count=100`, // request body
        );
    }
}