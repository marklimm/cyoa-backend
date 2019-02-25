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
    id: ID
    title: String
    description: String
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

  input UserInput {
    email: String!
    password: String!

    firstName: String!
    lastName: String!
    bio: String
  }

  type UserResponse {
    errors: [Error!]
    user: User
    auth: Authentication
  }

  type RootQuery {
    books: [Book!]!
    login(email: String!, password: String!): UserResponse!
    users: [User!]!
  }

  type RootMutation {
    createBook(bookInput: BookInput) : BookResponse!
    createUser(userInput: UserInput) : UserResponse!
    deleteBook(bookInput: BookInput) : BookResponse!
    updateBook(bookInput: BookInput) : BookResponse!
  }
  
  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`)
