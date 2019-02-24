const { buildSchema } = require('graphql')

module.exports = buildSchema(`

  type Authentication {
    token: String
    tokenExpiration: Int
  }

  type Book {
    _id: ID!
    title: String!
    description: String!
    authors: [User!]

    createdAt: String!
    updatedAt: String!
  }

  input BookInput {
    title: String!
    description: String!
  }

  type BookResponse {
    book: Book
    errors: [Error!]
  }

  type Error {
    message: String!
  }

  type User {
    _id: ID!
    email: String!
    password: String

    firstName: String!
    lastName: String!
    bio: String
    books: [Book!]

    createdAt: String!
    updatedAt: String!
  }
  
  type UserResponse {
    errors: [Error!]
    user: User
    auth: Authentication
  }

  input UserInput {
    email: String!
    firstName: String!
    lastName: String!
    password: String!
  }

  type RootQuery {
    books: [Book!]!
    login(email: String!, password: String!): UserAuthResponse!
    users: [User!]!
  }

  type RootMutation {
    createBook(bookInput: BookInput) : BookResponse
    createUser(userInput: UserInput) : UserResponse!
  }
  
  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`)
