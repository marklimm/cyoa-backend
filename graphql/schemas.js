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
    tags: [Tag!]

    createdAt: String!
    updatedAt: String!
  }

  input BookInput {
    _id: ID
    title: String
    description: String
    tags: [ID!]
  }

  type BookResponse {
    book: Book
    errors: [Error!]
  }

  type Error {
    message: String!
  }

  type Tag {
    _id: ID!
    label: String!
  }

  input TagInput {
    _id: ID
    label: String
  }

  type TagResponse {
    tag: Tag
    errors: [Error!]
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
    tags: [Tag!]!
    user(id: ID): [User!]!
    users: [User!]!
  }

  type RootMutation {
    createBook(bookInput: BookInput) : BookResponse!
    createTag(tagInput: TagInput) : TagResponse!
    createUser(userInput: UserInput) : UserResponse!
    deleteBook(bookInput: BookInput) : BookResponse!
    updateBook(bookInput: BookInput) : BookResponse!
  }
  
  schema {
    query: RootQuery,
    mutation: RootMutation
  }
`)
