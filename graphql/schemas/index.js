const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Book {
      _id: ID!
      title: String!
      description: String!
      createdDate: String!
      authors: [Author!]
    }

    input BookInput {
      title: String!
      description: String!
    }

    type Author {
      _id: ID!
      firstName: String!
      lastName: String!
      description: String
      createdDate: String!
      books: [Book!]
    }

    input AuthorInput {
      firstName: String!
      lastName: String!
      description: String
    }

    type User {
      _id: ID!
      email: String!
      password: String
      createdDate: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      authors: [Author!]!
      books: [Book!]!
      users: [User!]!
    }

    type RootMutation {
      createAuthor(authorInput: AuthorInput) : Author
      createBook(bookInput: BookInput) : Book
      createUser(userInput: UserInput) : User
    }
    
    schema {
      query: RootQuery,
      mutation: RootMutation
    }
  `)
