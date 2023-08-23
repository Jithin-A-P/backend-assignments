import { Repository } from "typeorm";
import BookShelfJn from "../entity/book-shelf-jn.entity";

class BookShelfJnRepository {
  constructor(private bookShelfRepository: Repository<BookShelfJn>) {}

  public getEntry = (isbn: string, shelfCode: string): Promise<BookShelfJn> => {
    return this.bookShelfRepository.findOne({
      where: {
        bookIsbn: isbn,
        shelfCode: shelfCode,
      },
    });
  };

  public getAllEntries = (isbn: string): Promise<BookShelfJn[]> => {
    return this.bookShelfRepository.find({
      where: {
        bookIsbn: isbn,
      },
    });
  };

  public addEntry = (bookShelfJnEntrie: BookShelfJn): Promise<BookShelfJn> => {
    return this.bookShelfRepository.save(bookShelfJnEntrie);
  };

  public addEntries = (bookShelfJnEntries: BookShelfJn[]): Promise<BookShelfJn[]> => {
    return this.bookShelfRepository.save(bookShelfJnEntries);
  };

  public updateEntry = async (bookShelfJnEntry: BookShelfJn): Promise<BookShelfJn> => {
    return this.bookShelfRepository.save(bookShelfJnEntry);
  };

  public removeEntries = async (bookShelfJnEntries: BookShelfJn[]): Promise<BookShelfJn[]> => {
    return this.bookShelfRepository.softRemove(bookShelfJnEntries);
  };
}

export default BookShelfJnRepository;
