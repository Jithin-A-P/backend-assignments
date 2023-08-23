import NotFoundException from '../exception/not-found.exception'
import BookDto from '../dto/book.dto'
import BookRepository from '../repository/book.repository'
import BookShelfJnRepository from '../repository/book-shelf-jn.repository'
import Book from '../entity/book.entity'
import BorrowedBookRepository from '../repository/borrowed-book.repository'
import BorrowBookDto from '../dto/borrow-book.dto'
import BorrowedBook from '../entity/borrowed-book.entity'
import BadRequestException from '../exception/bad-request.exception'
import { ILike, IsNull, MoreThan } from 'typeorm'

class BookService {
  constructor(
    private bookRepository: BookRepository,
    private bookShelfJnRepository: BookShelfJnRepository,
    private borrowedBookRepository: BorrowedBookRepository
  ) {}

  public getAllBooks = (
    rowsPerPage: number,
    pageNumber: number,
    searchQuery: string,
    category: string,
    available: string
  ): Promise<[Book[], number]> => {
    const defaultRowsPerPage = 15
    const take = rowsPerPage || defaultRowsPerPage

    const rowsToSkip = (pageNumber - 1) * take
    const skip = rowsToSkip > 0 ? rowsToSkip : 0

    const filters = {}

    if (category) filters['category'] = ILike(`%${category}%`)

    if (available) filters['availableCount'] = MoreThan(0)

    const searchFilter = [
      { ...filters, isbn: ILike(`%${searchQuery || '%'}%`) },
      { ...filters, title: ILike(`%${searchQuery || '%'}%`) },
      { ...filters, author: ILike(`%${searchQuery || '%'}%`) },
    ]

    return this.bookRepository.findAll(skip, take, searchFilter)
  }

  public getBookById = async (id: number): Promise<Book> => {
    const book = await this.bookRepository.findById(id, true)
    if (!book) throw new NotFoundException(`Book not found with id: ${id}`)

    const { bookShelfJns } = book
    delete book['bookShelfJns']

    book.shelves = bookShelfJns.map((bookShelfJn) => ({
      ...bookShelfJn.shelf,
      availableBookCount: bookShelfJn.bookCount,
    }))

    return book
  }

  public addBook = async (bookDto: BookDto): Promise<Book> => {
    const { shelves } = bookDto
    delete bookDto['shelves']

    const totalCount = shelves.reduce(
      (total, shelf) => total + shelf.bookCount,
      0
    )

    const addedBook = await this.bookRepository.addBook({
      ...(bookDto as any),
      totalCount: totalCount,
      availableCount: totalCount,
    })

    await this.bookShelfJnRepository.addEntries(
      shelves.map((shelf) => ({
        ...shelf,
        bookIsbn: addedBook.isbn,
      }))
    )

    return addedBook
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

    const updatedBook = await this.bookRepository.updateBook({
      ...currentBook,
      ...(bookDto as any),
      totalCount: totalCount,
      availableCount: availableCount,
    })

    const currentShelves = await this.bookShelfJnRepository.getAllEntries(
      updatedBook.isbn
    )

    this.bookShelfJnRepository.addEntries([
      ...currentShelves,
      ...shelves.map((shelf) => ({
        ...currentShelves.filter(
          (currentShelf) => currentShelf.shelfCode === shelf.shelfCode
        )['0'],
        ...shelf,
        bookIsbn: bookDto.isbn,
      })),
    ])

    return updatedBook
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

    if (!bookShelfEntry)
      throw new NotFoundException('Requested book no available')

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
      returnedAt: IsNull(),
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

    if (bookShelfEntry)
      await this.bookShelfJnRepository.updateEntry({
        ...bookShelfEntry,
        bookCount: bookShelfEntry.bookCount + 1,
      })
    else
      await this.bookShelfJnRepository.addEntry({
        shelfCode: shelfCode,
        bookIsbn: bookIsbn,
        bookCount: 1,
      })

    console.log({
      ...book,
      availableCount: book.availableCount + 1,
    })
    await this.bookRepository.updateBook({
      ...book,
      availableCount: book.availableCount + 1,
    })

    return updatedBorrowedBook
  }
}

export default BookService
