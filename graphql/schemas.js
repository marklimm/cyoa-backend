const { buildSchema } = require('graphql')

module.exports = buildSchema(`

    type AuthData {
      userId: ID!
      token: String!
      tokenExpiration: Int!
    }

    type Author {
      _id: ID!
      firstName: String!
      lastName: String!
      description: String
      books: [Book!]
      
      createdAt: String!
      updatedAt: String!
    }

    input AuthorInput {
      firstName: String!
      lastName: String!
      description: String
    }

    type Book {
      _id: ID!
      title: String!
      description: String!
      authors: [Author!]

      createdAt: String!
      updatedAt: String!
    }

    input BookInput {
      title: String!
      description: String!
    }

    type User {
      _id: ID!
      email: String!
      firstName: String!
      lastName: String!
      password: String

      createdAt: String!
      updatedAt: String!
    }

    input UserInput {
      email: String!
      firstName: String!
      lastName: String!
      password: String!
    }

    type RootQuery {
      authors: [Author!]!
      books: [Book!]!
      login(email: String!, password: String!): AuthData!
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
