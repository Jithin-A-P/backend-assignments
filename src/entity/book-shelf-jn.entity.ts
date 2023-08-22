import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import AbstractEntity from './absract.entity'
import Shelf from './shelf.entity'
import Book from './book.entity'

@Entity()
class BookShelfJn extends AbstractEntity {
  @Column()
  shelfCode: string

  @Column()
  bookIsbn: string

  @Column()
  bookCount: number

  @ManyToOne(() => Shelf, (shelf) => shelf.bookShelfJns)
  @JoinColumn({
    name: 'shelf_code',
    referencedColumnName: 'shelfCode',
  })
  shelf?: Shelf

  @ManyToOne(() => Book, (book) => book.bookShelfJns)
  @JoinColumn({
    name: 'book_isbn',
    referencedColumnName: 'isbn'
  })
  book?: Book
}

export default BookShelfJn
