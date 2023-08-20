import { Column, Entity, JoinTable, ManyToMany } from 'typeorm'
import AbstractEntity from './absract.entity'
import Shelf from './shelf.entity'
import Employee from './employee.entity'

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
  totalCount: number

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
  shelves?: Shelf[]

  @ManyToMany(() => Employee, (employee) => employee.borrowedBooks)
  borrowedByEmployees?: Employee[]
}

export default Book
