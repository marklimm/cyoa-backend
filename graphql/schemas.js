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

  type Error {
    message: String!
  }

  type LoginResponse {
    errors: [Error!]
    token: String
    tokenExpiration: Int
    userId: ID
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

  type UserResponse {
    errors: [Error!]
    user: User
  }

  type RootQuery {
    authors: [Author!]!
    books: [Book!]!
    login(email: String!, password: String!): LoginResponse!
    users: [User!]!
  }

  type RootMutation {
    createAuthor(authorInput: AuthorInput) : Author
    createBook(bookInput: BookInput) : Book
    createUser(userInput: UserInput) : UserResponse!
  }
  
  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`)
