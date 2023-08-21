import HttpException from "../exception/http.exception";
import NotFoundException from "../exception/not-found.exception";
import BookDto from "../dto/book.dto";
import EditBookDto from "../dto/edit-book.dto";
import BookRepository from "../repository/book.repository";
import BookShelfJnRepository from "../repository/book-shelf-jn.repository";
import Book from "../entity/book.entity";
import BookShelfJn from "../entity/book-shelf-jn.entity";

class BookService {
  constructor(
    private bookRepository: BookRepository,
    private bookShelfJnRepository: BookShelfJnRepository
  ) {}

  public getAllBooks = (): Promise<Book[]> => {
    return this.bookRepository.findAll();
  };

  public getBookById = async (id: number): Promise<Book> => {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundException(`Book not found with id: ${id}`);
    return book;
  };

  public getBookByISBN = async (isbn: string): Promise<Book> => {
    const book = await this.bookRepository.findByISBN(isbn);
    if (!book) throw new NotFoundException(`Book not found with isbn: ${isbn}`);
    return book;
  };

  public addBook = async (
    bookDto: BookDto
  ): Promise<Book> => {
    const newBook = this.bookRepository.addBook(bookDto);
    const bookShelfJnEntry = await this.bookShelfJnRepository.getEntry(
      bookDto.isbn,
      bookDto.shelfCode
    );
    if (bookShelfJnEntry) {
      bookShelfJnEntry.bookCount += bookDto.totalCount;
      this.bookShelfJnRepository.updateEntry(bookShelfJnEntry);
    } else {
      const newBookShelfJnEntry = new BookShelfJn();
      newBookShelfJnEntry.bookIsbn = bookDto.isbn;
      newBookShelfJnEntry.shelfCode = bookDto.shelfCode;
      newBookShelfJnEntry.bookCount = bookDto.totalCount;
      this.bookShelfJnRepository.addEntry(newBookShelfJnEntry);
    }
    return newBook;
  };

  public updateBook = async (
    id: number,
    bookDto: BookDto
  ): Promise<Book> => {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundException(`Book not found with id: ${id}`);

    if (book.totalCount < bookDto.totalCount) {
      bookDto.availableCount =
        book.availableCount + (bookDto.totalCount - book.totalCount);
      const bookShelfJnEntry = await this.bookShelfJnRepository.getEntry(
        bookDto.isbn,
        bookDto.shelfCode
      );
      bookShelfJnEntry.bookCount += bookDto.totalCount - book.totalCount;
      this.bookShelfJnRepository.updateEntry(bookShelfJnEntry);
    } else if (book.totalCount > bookDto.totalCount) {
      bookDto.availableCount =
        book.availableCount - (book.totalCount - bookDto.totalCount);
      const bookShelfJnEntry = await this.bookShelfJnRepository.getEntry(
        bookDto.isbn,
        bookDto.shelfCode
      );
      bookShelfJnEntry.bookCount -= book.totalCount - bookDto.totalCount;
      this.bookShelfJnRepository.updateEntry(bookShelfJnEntry);
    }

    return this.bookRepository.updateBook({
      ...book,
      ...bookDto,
    });
  };

  public editBook = async (
    id: number,
    editBookDto: EditBookDto,
  ): Promise<Book> => {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundException(`Book not found with id: ${id}`);

    for (const key in editBookDto)
      if (!(key in book)) throw new HttpException(400, `Bad Request`);

    if (editBookDto.shelfCode) {
      if (book.totalCount < editBookDto.totalCount) {
        editBookDto.availableCount =
          book.availableCount + (editBookDto.totalCount - book.totalCount);
        const bookShelfJnEntry = await this.bookShelfJnRepository.getEntry(
          editBookDto.isbn,
          editBookDto.shelfCode
        );
        bookShelfJnEntry.bookCount += editBookDto.totalCount - book.totalCount;
        this.bookShelfJnRepository.updateEntry(bookShelfJnEntry);
      } else if (book.totalCount > editBookDto.totalCount) {
        editBookDto.availableCount =
          book.availableCount - (book.totalCount - editBookDto.totalCount);
        const bookShelfJnEntry = await this.bookShelfJnRepository.getEntry(
          editBookDto.isbn,
          editBookDto.shelfCode
        );
        bookShelfJnEntry.bookCount -= book.totalCount - editBookDto.totalCount;
        this.bookShelfJnRepository.updateEntry(bookShelfJnEntry);
      }
    }

    const editedBook = await this.bookRepository.updateBook({
      ...book,
      ...editBookDto,
    });
    return editedBook;
  };

  public removeBook = async (id: number): Promise<Book> => {
    const book = await this.bookRepository.findById(id);
    if (!book) throw new NotFoundException(`Book not found with id: ${id}`);

    const bookShelfJnEntries = await this.bookShelfJnRepository.getAllEntries(book.isbn);
    this.bookShelfJnRepository.removeEntries(bookShelfJnEntries);
    return this.bookRepository.removeBook(book);
  };
}

export default BookService;
