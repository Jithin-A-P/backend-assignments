import NotFoundException from '../exception/not-found.exception'
import BookDto from '../dto/book.dto'
import EditBookDto from '../dto/edit-book.dto'
import BookRepository from '../repository/book.repository'
import BookShelfJnRepository from '../repository/book-shelf-jn.repository'
import Book from '../entity/book.entity'
import BorrowedBookRepository from '../repository/borrowed-books.repository'

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

  public getBookByISBN = async (isbn: string): Promise<Book> => {
    const book = await this.bookRepository.findByISBN(isbn)
    if (!book) throw new NotFoundException(`Book not found with isbn: ${isbn}`)
    return book
  }

  public addBook = async (bookDto: BookDto): Promise<Book> => {
    const { shelves } = bookDto
    delete bookDto['shelves']

    const totalCount = shelves.reduce((total, shelf) => total + shelf.bookCount, 0)

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

    const totalCount = shelves.reduce((total, shelf) => total + shelf.bookCount, 0)

    const { id: updatedBookId, isbn: updatedBookIsbn } =
      await this.bookRepository.updateBook({
        ...currentBook,
        ...(bookDto as any),
        totalCount: totalCount,
        availableCount: totalCount,
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

  public editBook = async (
    id: number,
    editBookDto: EditBookDto
  ): Promise<Book> => {
    const currentBook = await this.bookRepository.findById(id, false)
    if (!currentBook)
      throw new NotFoundException(`Book not found with id: ${id}`)

    // if (editBookDto.shelfCode) {
    //   if (book.totalCount < editBookDto.totalCount) {
    //     editBookDto.availableCount =
    //       book.availableCount + (editBookDto.totalCount - book.totalCount);
    //     const bookShelfJnEntry = await this.bookShelfJnRepository.getEntry(
    //       editBookDto.isbn,
    //       editBookDto.shelfCode
    //     );
    //     bookShelfJnEntry.bookCount += editBookDto.totalCount - book.totalCount;
    //     this.bookShelfJnRepository.updateEntry(bookShelfJnEntry);
    //   } else if (book.totalCount > editBookDto.totalCount) {
    //     editBookDto.availableCount =
    //       book.availableCount - (book.totalCount - editBookDto.totalCount);
    //     const bookShelfJnEntry = await this.bookShelfJnRepository.getEntry(
    //       editBookDto.isbn,
    //       editBookDto.shelfCode
    //     );
    //     bookShelfJnEntry.bookCount -= book.totalCount - editBookDto.totalCount;
    //     this.bookShelfJnRepository.updateEntry(bookShelfJnEntry);
    //   }
    // }

    // const editedBook = await this.bookRepository.updateBook({
    //   ...book,
    //   ...editBookDto,
    // });
    return new Book()
  }

  public removeBook = async (id: number): Promise<Book> => {
    const book = await this.bookRepository.findById(id, false)
    if (!book) throw new NotFoundException(`Book not found with id: ${id}`)

    const bookShelfJnEntries = await this.bookShelfJnRepository.getAllEntries(
      book.isbn
    )
    this.bookShelfJnRepository.removeEntries(bookShelfJnEntries)

    return this.bookRepository.removeBook(book)
  }

  // public lendBook = async (bookId: number): Promise<Book> => {
  //   const lendedBook = await this.bookRepository.findById(bookId, true)

  //   // await this.borrowed

  //   return lendedBook
  // }
}

export default BookService
