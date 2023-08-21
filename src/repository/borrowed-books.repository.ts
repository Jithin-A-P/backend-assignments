import { Repository } from 'typeorm'
import BorrowedBook from '../entity/borrowed-book.entity'

class BorrowedBookRepository {
  constructor(private borrowedBookRepository: Repository<BorrowedBook>) {}

  public findAll = (): Promise<BorrowedBook[]> => {
    return this.borrowedBookRepository.find()
  }
}

export default BorrowedBookRepository
