const express = require('express')

const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const mongoose = require('mongoose')

const Book = require('./models/book')

const app = express()

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

      return Book
        .find()
        .then(books => {
          return books
        })
        .catch(err => {
          console.log(err)
          throw err
        })
    },
    createBook: (args) => {
      const { bookInput } = args

      const book = new Book({
        title: bookInput.title,
        description: bookInput.description,
        createdDate: new Date()
      })

      return book
        .save()
        .then(book => {
          return book
        })
        .catch(err =>
          console.error(err)
        )
    }
  },
  graphiql: true
}))

app.get('/', (req, res, next) => {
  res.send('hello test wossssrld')
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qmxzo.mongodb.net/${process.env.CYOA_DB}?retryWrites=true`)
  .then(() => {
    app.listen(3001)
  })
  .catch(err => {
    console.error(err)
  })
