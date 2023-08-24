import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import AbstractEntity from './absract.entity'
import Employee from './employee.entity'
import BorrowedBook from './borrowed-book.entity'

@Entity()
class CronJob extends AbstractEntity {
  @Column()
  employeeId: string

  @Column()
  borrowedBookId: string

  @OneToOne(() => BorrowedBook, (borrowedBook) => borrowedBook.overdueCronJob)
  @JoinColumn()
  borrowedBook?: BorrowedBook

  @ManyToOne(() => Employee, (employee) => employee.cronJobs)
  employee?: Employee
}

export default CronJob
