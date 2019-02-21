const Author = require('./author-model')
const { formatAuthors } = require('../entity-relations/author-book')

const addBookToAuthor = async (authorId, book) => {
  try {
    const author = await Author.findById(authorId)

    if (!author) {
      return {
        errors: [
          {
            message: `Attempt to add a book to an author failed because the author wasn't found`
          }
        ]
      }
    }

    author.books.push(book)

    const savedAuthor = await author.save()
    return savedAuthor
  } catch (err) {
    console.log(err)
    throw err
  }
}

const authors = async () => {
  try {
    const authors = await Author.find().sort({ firstName: 1, lastName: 1 })

    return formatAuthors(authors)
  } catch (err) {
    console.log(err)
    throw err
  }
}

const createAuthor = async (args, req) => {
  if (!req.isAuth) {
    return {
      errors: [
        {
          message: `You are not authenticated to create an author`
        }
      ]
    }
  }

  const { authorInput } = args

  const author = new Author({
    firstName: authorInput.firstName,
    lastName: authorInput.lastName,
    description: authorInput.description,
    books: []
  })

  try {
    const savedAuthor = await author.save()

    const inflatedAuthor = formatAuthors([savedAuthor])[0]
    return inflatedAuthor
  } catch (err) {
    console.log(err)
    throw err
  }
}

module.exports = {
  addBookToAuthor,
  authors,
  createAuthor
}
