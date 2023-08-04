import {
  Column,
  Entity,
  OneToOne,
} from 'typeorm'
import Address from './address.entity'
import AbstractEntity from './absract.entiry'

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
}

export default Employee
