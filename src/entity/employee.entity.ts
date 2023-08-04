import {
  Column,
  Entity,
  OneToOne,
} from 'typeorm'
import Address from './address.entity'
import AbstractEntity from './absract.entiry'
import { Role } from '../utils/role.enum'

@Entity('employee') // PARAM: name of the table
class Employee extends AbstractEntity {
  @Column()
  name: string

  @Column()
  email: string

  @Column({nullable: true})
  age: number

  @OneToOne(() => Address, (address) => address.employee, {cascade: true})
  address?: Address

  @Column()
  password: string

  @Column({ default: Role.DEVELOPER })
  role: Role
}

export default Employee
