import { Column, Entity, ManyToMany } from 'typeorm'
import AbstractEntity from './absract.entity'
import Book from './book.entity'

@Entity()
class Shelf extends AbstractEntity {
  @Column({ unique: true })
  shelfCode: string

  @Column()
  location: string

  @ManyToMany(() => Book, (book) => book.shelves)
  books: Book[]
}

export default Shelf
