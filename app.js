const express = require('express')
const mongoose = require('mongoose')

const graphqlHttp = require('express-graphql')

const graphQlSchema = require('./graphql/schemas')
const graphQlResolvers = require('./graphql/resolvers')

const app = express()

app.use(express.json())

app.use('/graphql', graphqlHttp({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true
}))

app.get('/', (req, res, next) => {
  res.send('hello test wossssrld')
})

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-qmxzo.mongodb.net/${process.env.CYOA_DB}?retryWrites=true`, {
  useNewUrlParser: true
})
  .then(() => {
    app.listen(3001)
  })
  .catch(err => {
    console.error(err)
  })
