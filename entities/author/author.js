const Author = require('./author-model')
const { formatAuthors } = require('../entity-relations/author-book')

const addBookToAuthor = async (authorId, book) => {
  const author = await Author.findById(authorId)

  if (!author) {
    throw new Error('Author was not found')
  }

  author.books.push(book)

  const savedAuthor = await author.save()
  return savedAuthor
}

const authors = async () => {
  const authors = await Author.find()

  return formatAuthors(authors)
}

const createAuthor = async (args, req) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated!')
  }

  const { authorInput } = args

  const author = new Author({
    firstName: authorInput.firstName,
    lastName: authorInput.lastName,
    description: authorInput.description,
    books: []
  })

  const savedAuthor = await author.save()

  const inflatedAuthor = formatAuthors([savedAuthor])[0]
  return inflatedAuthor
}

module.exports = {
  addBookToAuthor,
  authors,
  createAuthor
}
