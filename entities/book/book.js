const Book = require('./book-model')
const { formatBooks } = require('../entity-relations/author-book')
const { addBookToAuthor } = require('../author/author')

const books = async () => {
  try {
    const books = await Book.find()
    return formatBooks(books)
  } catch (err) {
    console.log(err)
    throw err
  }
}

const createBook = async (args, req) => {
  if (!req.isAuth) {
    throw new Error('Unauthenticated!')
  }

  const { bookInput } = args

  const hardCodedAuthorId = '5c5794c06512891bcc4446a6'

  const book = new Book({
    title: bookInput.title,
    description: bookInput.description,

    //  hardcoding an author value
    authors: [hardCodedAuthorId]
  })

  try {
    const savedBook = await book.save()

    //  add this book to the appropriate author's "books" list
    await addBookToAuthor(hardCodedAuthorId, savedBook)

    const inflatedBook = formatBooks([savedBook])[0]
    return inflatedBook
  } catch (err) {
    console.error(err)
    throw err
  }
}

module.exports = {
  books,
  createBook
}
