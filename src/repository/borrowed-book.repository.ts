import { Repository } from 'typeorm'
import BorrowedBook from '../entity/borrowed-book.entity'

class BorrowedBookRepository {
  constructor(private borrowedBookRepository: Repository<BorrowedBook>) {}

  public findAll = (): Promise<BorrowedBook[]> => {
    return this.borrowedBookRepository.find()
  }

  public addBorrowedBook = (borrowedBook: BorrowedBook): Promise<BorrowedBook> => {
    return this.borrowedBookRepository.save(borrowedBook)
  }

  public findBy = (filter): Promise<BorrowedBook> => {
    return this.borrowedBookRepository.findOneBy(filter)
  } 

  public updateBorrowedBook = (borrowedBook: BorrowedBook): Promise<BorrowedBook> => {
    return this.borrowedBookRepository.save(borrowedBook)
  }
}

export default BorrowedBookRepository
