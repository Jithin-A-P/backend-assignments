import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import AbstractEntity from './absract.entity'
import Shelf from './shelf.entity'

@Entity()
class Book extends AbstractEntity {
  @Column({ unique: true })
  isbn: string

  @Column()
  title: string

  @Column()
  author: string

  @Column()
  category: string

  @Column({ nullable: true })
  description?: string

  @Column({ nullable: true })
  publisher?: string

  @Column({ nullable: true })
  releaseDate?: string

  @Column({ nullable: true })
  thumbnailUrl?: string

  @Column()
  toatlCount: number

  @Column()
  availableCount: number

  @ManyToMany(() => Shelf, (shelf) => shelf.books)
  @JoinTable({
    name: 'book_shelf_jn',
    joinColumn: {
      name: 'book_isbn',
      referencedColumnName: 'isbn',
    },
    inverseJoinColumn: {
      name: 'shelf_code',
      referencedColumnName: 'shelfCode'
    }
  })
  shelves: Shelf[]
}

export default Book
