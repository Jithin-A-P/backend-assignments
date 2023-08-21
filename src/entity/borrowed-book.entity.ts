import { Column, Entity, OneToOne } from 'typeorm'
import AbstractEntity from './absract.entity'
import Shelf from './shelf.entity'

@Entity()
class BorrowedBook extends AbstractEntity {
  @Column()
  employeeId: number

  @Column()
  bookIsbn: string

  @Column()
  @OneToOne(() => Shelf)
  shelfBorrowedFrom: string

  @Column({ nullable: true })
  @OneToOne(() => Shelf)
  shelfReturnedTo?: string

  @Column()
  borrowedAt: string

  @Column({ nullable: true })
  returnedAt?: string
}

export default BorrowedBook
