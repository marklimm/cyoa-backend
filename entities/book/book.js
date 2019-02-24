const Book = require('./book-model')
const { formatBooks } = require('../entity-relations/user-book')
const { addBookToUser } = require('../user/user')

const books = async () => {
  try {
    const books = await Book.find().sort({ title: 1 })
    return formatBooks(books)
  } catch (err) {
    console.log(err)
    throw err
  }
}

const createBook = async (args, req) => {
  if (!req.isAuth) {
    return {
      errors: [{ message: 'You are not authenticated to create a book' }]
    }
  }

  const { bookInput } = args

  const hardCodedUserId = req.userId

  const book = new Book({
    title: bookInput.title,
    description: bookInput.description,

    //  hardcoding an author value
    authors: [hardCodedUserId]
  })

  try {
    const savedBook = await book.save()

    //  add this book to the appropriate author's "books" list
    await addBookToUser(hardCodedUserId, savedBook)

    const inflatedBook = formatBooks([savedBook])[0]

    return {
      book: inflatedBook
    }
  } catch (err) {
    console.error(err)
    throw err
  }
}

module.exports = {
  books,
  createBook
}
