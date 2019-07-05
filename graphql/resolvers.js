const bookResolvers = require('../entities/book/book')
const tagResolvers = require('../entities/tag/tag')
const userResolvers = require('../entities/user/user')

module.exports = {
  ...bookResolvers,
  ...tagResolvers,
  ...userResolvers
}
