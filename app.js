const express = require('express')
const mongoose = require('mongoose')

const graphqlHttp = require('express-graphql')

const graphQlSchema = require('./graphql/schemas')
const graphQlResolvers = require('./graphql/resolvers')

const isAuth = require('./middleware/is-auth')

const {
  getBookLoader,
  getTagLoader,
  getUserLoader
} = require('./entities/entity-relations/user-book')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  //  OPTIONS method requests are fine
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }

  next()
})

app.use(isAuth)

app.use(
  '/graphql',
  graphqlHttp(req => {
    return {
      schema: graphQlSchema,
      rootValue: graphQlResolvers,
      graphiql: true,
      context: {
        req,
        contextCreationTime: new Date(),
        loaders: {
          bookLoader: getBookLoader(),
          tagLoader: getTagLoader(),
          userLoader: getUserLoader()
        }
      }
    }
  })
)

app.get('/', (req, res, next) => {
  res.send('hello test wossssrld')
})

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${
      process.env.MONGO_CLUSTER_NAME
    }/${process.env.CYOA_DB}?retryWrites=true`,
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    const port = process.env.PORT || 3001
    app.listen(port)
  })
  .catch(err => {
    console.error(err)
  })
