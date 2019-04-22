const { PubSub } = require('apollo-server-express');

export const pubsub = new PubSub();

const TWEET_ADDED = 'TWEET_ADDED';



const resolvers = {
    Query: {
        author(parent, args, context, info) {
            let author = authors.filter( function (author, i) {
                return author.id === parseFloat(args.id);
            });
            return author[0];
        },
        searchTweets: async (_source, { tweet }, { dataSources }) => {
            let results =  await dataSources.twitter.postSearch(tweet.keyword);
            return results.statuses.map( result => {

                let media;

                try {
                    media = result.entities.media[0].media_url_https;
                }catch (e) {}

                return {
                    id: result.id,
                    text: result.text,
                    user: result.user.screen_name,
                    media: media
                };

            })
        },
        post: async (_source, {Status}, { dataSources }) => {
            return dataSources.twitter.postStatus(Status);
        },
        stream: async (_source, {Status}, { dataSources }) => {
            return dataSources.twitter.getStream(Status);
        },
        auth: async (_source, { tweet }, { dataSources }) => {
            return dataSources.twitter.generateBearer();
        },
        getbearer: async (_source, { tweet }, { dataSources }) => {
            return dataSources.twitter.getbearer();
        },
        getGender: async (_source, { url }, { dataSources }) => {
            let result = dataSources.genderML.detect(url).then( result => {
                // console.log(result.result.length)
                // console.log(result.result)
                if( result.status !== "ok" ){
                    return new Error('Internal ML server error');
                }
                if(result.result.length === 1){
                    return result.result[0].gender;
                }else {
                    return new Error('please choose an image with single humain');
                }

            });

            return result;
        },
    },
    Subscription: {
        tweetsAdded: {
            // Additional event labels can be passed to asyncIterator creation
            subscribe: () => pubsub.asyncIterator([TWEET_ADDED]),
        },
    },
    Mutation: {
        // addPost(root, args, context) {
        //     pubsub.publish(TWEET_ADDED, { postAdded: args });
        //     return postController.addPost(args);
        // },
        stream: async (_source, {Keyword}, { dataSources }) => {

            // await pubsub.publish(TWEET_ADDED, { tweetsAdded: Keyword });
            let tweets = await dataSources.twitter.getStream(Keyword,'START')

            return "Stream ON " + Keyword;
        },
        streamStop: async (_source, {Keyword}, { dataSources }) => {

            let tweets = await dataSources.twitter.getStream( ' ', 'STOP')

            return "Stream Stoped";
        },
    },
};

export default resolvers;