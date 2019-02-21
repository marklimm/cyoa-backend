const { buildSchema } = require('graphql')

module.exports = buildSchema(`

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

  type AuthorResponse {
    author: Author!
    errors: [Error!]
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

  type BookResponse {
    book: Book!
    errors: [Error!]
  }

  type Error {
    message: String!
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
  
  type UserAuthResponse {
    errors: [Error!]
    firstName: String
    token: String
    tokenExpiration: Int
    userId: ID
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
    login(email: String!, password: String!): UserAuthResponse!
    users: [User!]!
  }

  type RootMutation {
    createAuthor(authorInput: AuthorInput) : AuthorResponse
    createBook(bookInput: BookInput) : BookResponse
    createUser(userInput: UserInput) : UserAuthResponse!
  }
  
  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`)
