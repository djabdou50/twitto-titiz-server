const { gql } = require('apollo-server-express');

const schema = gql`
  type Book {
    title: String
    author: Author
  }

  type Author {
    id:Float
    books: [Book]
  }
  
  input TweetInput {
    keyword: String
  }
  
  type Tweet {
    id: Float
    text: String
    user: String
    media: String
  }
  
  type Status {
    text: String
  }
  
  type Subscription {
    tweetsAdded: Tweet
  }
  
  type Gender {
    result: String
  }

  type Query {
    author(id:ID): Author
    searchTweets(tweet:TweetInput): [Tweet]
    auth: String
    getbearer: String
    post(Status: String): String
    stream(Keyword: String): String
    getGender(url: String): String
  }
  
  type Mutation {
    stream(Keyword: String): String
    streamStop: String
  }
`

export default schema;
