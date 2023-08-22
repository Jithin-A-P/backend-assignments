import { Column, Entity, OneToMany } from 'typeorm'
import AbstractEntity from './absract.entity'
import BorrowedBook from './borrowed-book.entity'
import BookShelfJn from './book-shelf-jn.entity'

@Entity()
class Shelf extends AbstractEntity {
  @Column({ unique: true })
  shelfCode: string

  @Column()
  location: string

  @OneToMany(() => BookShelfJn, (bookShelfJn) => bookShelfJn.shelf)
  bookShelfJns?: BookShelfJn[]

  @OneToMany(() => BorrowedBook, (borrowedBook) => borrowedBook.borrowedFrom)
  borrowedBooks?: BorrowedBook[]

  @OneToMany(() => BorrowedBook, (borrowedBook) => borrowedBook.returnedTo)
  returnedBooks?: BorrowedBook[]

  books?: any[]
}

export default Shelf
