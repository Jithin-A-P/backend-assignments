import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'
import Address from './address.entity'
import AbstractEntity from './absract.entity'
import Role from '../utils/role.enum'
import Department from './department.entity'
import Status from '../utils/status.enum'

@Entity('employee') // PARAM: name of the table
class Employee extends AbstractEntity {
  @Column()
  name: string

  @Column()
  email: string

  @Column()
  joiningDate: string

  @Column()
  password: string

  @Column({ default: 0 })
  experience: number

  @Column({ default: Role.DEVELOPER })
  role: Role

  @Column({ default: Status.ACTIVE })
  status: Status

  @ManyToOne(() => Department, (department) => department.employees)
  department: number

  @OneToOne(() => Address, (address) => address.employee, { cascade: true })
  address: Address
}

export default Employee
