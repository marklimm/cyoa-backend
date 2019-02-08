const authorResolvers = require('../entities/author/author')
const bookResolvers = require('../entities/book/book')
const userResolvers = require('../entities/user/user')

module.exports = {
  ...authorResolvers,
  ...bookResolvers,
  ...userResolvers
}
