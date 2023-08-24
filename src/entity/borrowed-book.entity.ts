import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import AbstractEntity from './absract.entity'
import Shelf from './shelf.entity'
import Employee from './employee.entity'
import Book from './book.entity'
import CronJob from './cron-job.entity'

@Entity()
class BorrowedBook extends AbstractEntity {
  @Column()
  employeeId: string

  @Column()
  bookIsbn: string

  @Column()
  borrowedAt: string

  @Column({ nullable: true })
  returnedAt?: string

  @Column()
  shelfBorrowedFrom: string

  @Column({ nullable: true })
  shelfReturnedTo?: string
  
  @OneToOne(() => CronJob, (cronJob) => cronJob.borrowedBook)
  overdueCronJob?: CronJob

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

  @ManyToOne(() => Book, (book) => book.borrowedBooks)
  @JoinColumn({
    name: 'book_isbn',
    referencedColumnName: 'isbn'
  })
  book?: Book

  @ManyToOne(() => Employee, (employee) => employee.borrowedBooks)
  @JoinColumn({
    name: 'employee_id',
    referencedColumnName: 'id'
  })
  employee?: Employee

}

export default BorrowedBook
