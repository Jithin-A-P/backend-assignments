import NotFoundException from '../exception/not-found.exception'
import BookDto from '../dto/book.dto'
import BookRepository from '../repository/book.repository'
import BookShelfJnRepository from '../repository/book-shelf-jn.repository'
import Book from '../entity/book.entity'
import BorrowedBookRepository from '../repository/borrowed-book.repository'
import BorrowBookDto from '../dto/borrow-book.dto'
import BorrowedBook from '../entity/borrowed-book.entity'
import BadRequestException from '../exception/bad-request.exception'

class BookService {
  constructor(
    private bookRepository: BookRepository,
    private bookShelfJnRepository: BookShelfJnRepository,
    private borrowedBookRepository: BorrowedBookRepository
  ) {}

  public getAllBooks = (): Promise<Book[]> => {
    return this.bookRepository.findAll()
  }

  public getBookById = async (id: number): Promise<Book> => {
    const book = await this.bookRepository.findById(id, true)
    if (!book) throw new NotFoundException(`Book not found with id: ${id}`)
    return book
  }

  public addBook = async (bookDto: BookDto): Promise<Book> => {
    const { shelves } = bookDto
    delete bookDto['shelves']

    const totalCount = shelves.reduce(
      (total, shelf) => total + shelf.bookCount,
      0
    )

    const { id: addedBookId, isbn: addedBookIsbn } =
      await this.bookRepository.addBook({
        ...(bookDto as any),
        totalCount: totalCount,
        availableCount: totalCount,
      })

    this.bookShelfJnRepository.addEntries(
      shelves.map((shelf) => ({
        ...shelf,
        bookIsbn: addedBookIsbn,
      }))
    )

    return await this.bookRepository.findById(addedBookId, true)
  }

  public updateBook = async (id: number, bookDto: BookDto): Promise<Book> => {
    const currentBook = await this.bookRepository.findById(id, false)
    if (!currentBook)
      throw new NotFoundException(`Book not found with id: ${id}`)

    const { shelves } = bookDto
    delete bookDto['shelves']

    const availableCount = shelves.reduce(
      (total, shelf) => total + shelf.bookCount,
      0
    )

    const availableCountDifference = availableCount - currentBook.availableCount

    const totalCount = currentBook.totalCount + availableCountDifference

    const { id: updatedBookId, isbn: updatedBookIsbn } =
      await this.bookRepository.updateBook({
        ...currentBook,
        ...(bookDto as any),
        totalCount: totalCount,
        availableCount: availableCount,
      })

    const currentShelves = await this.bookShelfJnRepository.getAllEntries(
      updatedBookIsbn
    )

    this.bookShelfJnRepository.addEntries(
      shelves.map((shelf) => ({
        ...currentShelves.filter(
          (currentShelf) => currentShelf.shelfCode === shelf.shelfCode
        )['0'],
        ...shelf,
      }))
    )

    return await this.bookRepository.findById(updatedBookId, true)
  }

  public removeBook = async (id: number): Promise<Book> => {
    const book = await this.bookRepository.findById(id, false)
    if (!book) throw new NotFoundException(`Book not found with id: ${id}`)

    const bookShelfJnEntries = await this.bookShelfJnRepository.getAllEntries(
      book.isbn
    )
    await this.bookShelfJnRepository.removeEntries(bookShelfJnEntries)

    return await this.bookRepository.removeBook(book)
  }

  public borrowBook = async (
    bookIsbn: string,
    borrowBookDto: BorrowBookDto
  ): Promise<BorrowedBook> => {
    const book = await this.bookRepository.findByISBN(bookIsbn, false)

    if (!book)
      throw new NotFoundException(
        `No books are available with isbn ${bookIsbn}`
      )

    if (book.availableCount === 0)
      throw new BadRequestException('Requested book not available')

    const { shelfCode, employeeId } = borrowBookDto

    const bookShelfEntry = await this.bookShelfJnRepository.getEntry(
      bookIsbn,
      shelfCode
    )

    if (bookShelfEntry.bookCount === 0)
      throw new BadRequestException('Requested book not available on the shelf')

    const borrowedBook = await this.borrowedBookRepository.addBorrowedBook({
      bookIsbn: bookIsbn,
      employeeId: employeeId,
      shelfBorrowedFrom: shelfCode,
      borrowedAt: new Date().toISOString(),
    })

    await this.bookShelfJnRepository.updateEntry({
      ...bookShelfEntry,
      bookCount: bookShelfEntry.bookCount - 1,
    })

    await this.bookRepository.updateBook({
      ...book,
      availableCount: book.availableCount - 1,
    })

    return borrowedBook
  }

  public returnBook = async (
    bookIsbn: string,
    borrowBookDto: BorrowBookDto
  ): Promise<BorrowedBook> => {
    const book = await this.bookRepository.findByISBN(bookIsbn, false)

    if (!book)
      throw new NotFoundException(`No books are found with isbn ${bookIsbn}`)

    const { shelfCode, employeeId } = borrowBookDto

    const bookShelfEntry = await this.bookShelfJnRepository.getEntry(
      bookIsbn,
      shelfCode
    )

    const borrowedBook = await this.borrowedBookRepository.findBy({
      employeeId: employeeId,
      bookIsbn: bookIsbn,
    })

    if (!borrowedBook)
      throw new BadRequestException("Employee hasn't borrowed this book")

    if (borrowedBook.returnedAt)
      throw new BadRequestException('Book was already returned')

    const updatedBorrowedBook =
      await this.borrowedBookRepository.updateBorrowedBook({
        ...borrowedBook,
        returnedAt: new Date().toISOString(),
        shelfReturnedTo: shelfCode,
      })

    await this.bookShelfJnRepository.updateEntry({
      ...bookShelfEntry,
      bookCount: bookShelfEntry.bookCount + 1,
    })

    await this.bookRepository.updateBook({
      ...book,
      availableCount: book.availableCount + 1,
    })

    return updatedBorrowedBook
  }
}

export default BookService
