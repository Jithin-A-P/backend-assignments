import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm'
import Address from './address.entity'
import AbstractEntity from './absract.entity'
import Role from '../utils/role.enum'
import Department from './department.entity'
import Status from '../utils/status.enum'
import Notification from './notification.entity'
import BorrowedBook from './borrowed-book.entity'
import Book from './book.entity'
import Subscription from './subscription.entity'

@Entity('employee')
class Employee extends AbstractEntity {
  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  joiningDate: string

  @Column()
  password: string

  @Column({ default: 0 })
  experience: number

  @Column({ default: Role.EMPLOYEE })
  role: Role

  @Column({ default: Status.ACTIVE })
  status: Status

  @Column({ name: 'department_id' })
  departmentId: string

  @ManyToOne(() => Department, (department) => department.employees)
  @JoinColumn({ name: 'department_id' })
  department?: Department

  @OneToOne(() => Address, (address) => address.employee, { cascade: true })
  address: Address

  @OneToMany(() => Notification, (notification) => notification.employee)
  notifications?: Notification[]

  @OneToMany(() => BorrowedBook, (borrowedBook) => borrowedBook.employee)
  borrowedBooks?: BorrowedBook[] | Book[]

  @OneToMany(() => Subscription, (subscription) => subscription.requestFrom)
  requestByUser?: Subscription[]

  @OneToMany(() => Subscription, (subscription) => subscription.requestTo)
  requestToUser?: Subscription[]
}

export default Employee
