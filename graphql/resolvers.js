// const { find, filter } = require('lodash');

let authors = [
    {id: 1, name:"aut name 1"},
    {id: 2, name:"aut name 2"}
];

let books = [
    {title: "book title1", author: 1 },
    {title: "book title2", author: 1 }
];

const resolvers = {
    Query: {
        author(parent, args, context, info) {
            let author = authors.filter( function (author, i) {
                return author.id === parseFloat(args.id);
            });
            return author[0];
        },
        searchTweets: async (_source, { tweet }, { dataSources }) => {

            let result =  await dataSources.twitterApi.postSearch(tweet.keyword);
            console.log(result)
            return result;
        },
    },
    Author: {
        books(parent, args, context, info) {
            return books.filter( function (book, i) {
                return book.author === parent.id;
            });

        },
    },
    Tweet: async (_source, { tweet }, { dataSources }) => {
        return dataSources.twitterApi.postSearch(tweet);
    },
};

export default resolvers;