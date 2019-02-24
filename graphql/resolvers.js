const bookResolvers = require('../entities/book/book')
const userResolvers = require('../entities/user/user')

module.exports = {
  ...bookResolvers,
  ...userResolvers
}
