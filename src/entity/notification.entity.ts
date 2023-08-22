import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import AbstractEntity from './absract.entity'
import Book from './book.entity'
import Employee from './employee.entity'

@Entity()
class Notification extends AbstractEntity {
  @Column()
  employeeId: number

  @Column()
  bookIsbn: string

  @Column()
  status: string

  @Column()
  type: string

  @Column()
  content: string

  @ManyToOne(() => Book, (book) => book.notifications)
  @JoinColumn({
    name: 'book_isbn',
    referencedColumnName: 'isbn'
  })
  book?: Book

  @ManyToOne(() => Employee, (employee) => employee.notifications)
  @JoinColumn({
    name: 'employee_id',
    referencedColumnName: 'id'
  })
  employee?: Employee

}

export default Notification;
