const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

const books = []

app.use(express.json())

app.use('/graphql', graphqlHttp({
  schema: buildSchema(`
    type Book {
      _id: ID!
      title: String!
      description: String!
      createdDate: String!
    }

    input BookInput {
      title: String!
      description: String!
    }

    type RootQuery {
      books: [Book!]!
    }

    type RootMutation {
      createBook(bookInput: BookInput) : Book
    }
    
    schema {
      query: RootQuery,
      mutation: RootMutation
    }
  `),
  rootValue: {
    books: () => {
      // return ['Apple picking', 'Bear hunting', 'Canada admiring']
      return books
    },
    createBook: (args) => {
      const { bookInput } = args

      const book = {
        _id: Math.random().toString(),
        title: bookInput.title,
        description: bookInput.description,
        createdDate: new Date().toISOString()
      }

      books.push(book)

      return book
    }
  },
  graphiql: true
}))

app.get('/', (req, res, next) => {
  res.send('hello test wossssrld')
})

app.listen(3001)
