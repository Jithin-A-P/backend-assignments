import { Repository } from "typeorm";
import Book from "../entity/book.entity";

class BookRepository {
  constructor(private bookRepository: Repository<Book>) {}

  public findAll = (): Promise<Book[]> => {
    return this.bookRepository.find({
      relations: {
        shelves: true,
      },
    });
  };

  public findById = (id: number): Promise<Book> => {
    return this.bookRepository.findOne({
      where: { id: id },
      relations: {
        shelves: true,
      },
    });
  };

  public findByISBN = (isbn: string): Promise<Book> => {
    return this.bookRepository.findOne({
      where: { isbn: isbn },
      relations: {
        shelves: true,
      },
    });
  };

  public addBook = (book: Book): Promise<Book> => {
    return this.bookRepository.save(book);
  };

  public updateBook = (book: Book): Promise<Book> => {
    return this.bookRepository.save(book);
  };

  public removeBook = (book: Book): Promise<Book> => {
    return this.bookRepository.softRemove(book);
  };
}

export default BookRepository;
