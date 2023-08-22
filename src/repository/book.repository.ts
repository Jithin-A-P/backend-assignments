import { Repository } from 'typeorm'
import Book from '../entity/book.entity'

class BookRepository {
  constructor(private bookRepository: Repository<Book>) {}

  public findAll = (skip: number, take: number): Promise<Book[]> => {
    return this.bookRepository.find({
      skip: skip,
      take: take,
    })
  }

  public findById = (id: number, getShlefDetails: boolean): Promise<Book> => {
    return this.bookRepository.findOne({
      relations: {
        bookShelfJns: {
          shelf: getShlefDetails,
        }
      },
      where: { id: id },
    })
  }

  public findByISBN = (
    isbn: string,
    getShlefDetails: boolean
  ): Promise<Book> => {
    return this.bookRepository.findOne({
      where: { isbn: isbn },
      relations: {
        bookShelfJns: {
          shelf: getShlefDetails,
        }
      },
    })
  }

  public addBook = (book: Book): Promise<Book> => {
    return this.bookRepository.save(book)
  }

  public updateBook = (book: Book): Promise<Book> => {
    return this.bookRepository.save(book)
  }

  public removeBook = (book: Book): Promise<Book> => {
    return this.bookRepository.softRemove(book)
  }
}

export default BookRepository
