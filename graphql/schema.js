const { gql } = require('apollo-server-express');

const schema = gql`
  
  input TweetInput {
    keyword: String
  }
  
  type Tweet {
    id: Float
    text: String
    user: String
    media: String
    created_at: String
    screen_name: String
    gender: String
    _id: String
  }
  
  type Status {
    text: String
  }
  
  type Gender {
    result: String
  }
  
  type Selfies {
    male: [Tweet]
    female: [Tweet]
  }
  
  input offsetInput {
    offset: Float
  }

  type Query {
    searchTweets(tweet:TweetInput): [Tweet]
    stream(Keyword: String): String
    getGender(url: String): String
    getSelfies(offset: offsetInput): Selfies
  }
  
  type Mutation {
    stream(Keyword: String): String
    streamStop: String
  }
  
  type Subscription {
    tweetsAdded: Tweet
    getTweets: Tweet
  }
`;

export default schema;
