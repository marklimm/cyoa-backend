const authorResolvers = require('./author')
const bookResolvers = require('./book')
const userResolvers = require('./user')

module.exports = {
  ...authorResolvers,
  ...bookResolvers,
  ...userResolvers
}
