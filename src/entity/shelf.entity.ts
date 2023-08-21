import { Column, Entity, ManyToMany, OneToMany } from 'typeorm'
import AbstractEntity from './absract.entity'
import Book from './book.entity'
import BorrowedBook from './borrowed-book.entity'

@Entity()
class Shelf extends AbstractEntity {
  @Column({ unique: true })
  shelfCode: string

  @Column()
  location: string

  @ManyToMany(() => Book, (book) => book.shelves)
  books?: Book[]

  @OneToMany(() => BorrowedBook, (borrowedBook) => borrowedBook.borrowedFrom)
  borrowedBooks?: BorrowedBook[]

  @OneToMany(() => BorrowedBook, (borrowedBook) => borrowedBook.returnedTo)
  returnedBooks?: BorrowedBook[]
}

export default Shelf
