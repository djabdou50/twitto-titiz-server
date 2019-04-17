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
  }

  type Query {
    author(id:ID): Author
    searchTweets(tweet:TweetInput): [Tweet]
  }
`

export default schema;
