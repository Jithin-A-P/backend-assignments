import { Column, Entity, JoinColumn, ManyToMany, OneToMany, ManyToOne } from 'typeorm'
import AbstractEntity from './absract.entity'
import Book from './book.entity'
import BorrowedBook from './borrowed-book.entity'
import BookShelfJn from './book-shelf-jn.entity'

@Entity()
class Shelf extends AbstractEntity {
  @Column({ unique: true })
  shelfCode: string

  @Column()
  location: string

  @OneToMany(() => BookShelfJn, (bookShelfJn) => bookShelfJn.shelf)
  bookShelfJn?: BookShelfJn[]

  @OneToMany(() => BorrowedBook, (borrowedBook) => borrowedBook.borrowedFrom)
  borrowedBooks?: BorrowedBook[]

  @OneToMany(() => BorrowedBook, (borrowedBook) => borrowedBook.returnedTo)
  returnedBooks?: BorrowedBook[]
}

export default Shelf
