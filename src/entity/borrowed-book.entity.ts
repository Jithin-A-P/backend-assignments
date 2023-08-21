import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import AbstractEntity from './absract.entity'
import Shelf from './shelf.entity'

@Entity()
class BorrowedBook extends AbstractEntity {
  @Column()
  employeeId: number

  @Column()
  bookIsbn: string

  @Column()
  shelfBorrowedFrom: string

  @Column({ nullable: true })
  shelfReturnedTo?: string

  @ManyToOne(() => Shelf, (shelf) => shelf.borrowedBooks)
  @JoinColumn({
    name: 'shelf_borrowed_from',
    referencedColumnName: 'shelfCode',
  })
  borrowedFrom?: Shelf

  @ManyToOne(() => Shelf, (shelf) => shelf.returnedBooks)
  @JoinColumn({
    name: 'shelf_returned_to',
    referencedColumnName: 'shelfCode',
  })
  returnedTo?: Shelf

  @Column()
  borrowedAt: string

  @Column({ nullable: true })
  returnedAt?: string
}

export default BorrowedBook
