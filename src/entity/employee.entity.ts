import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import Address from './address.entity'

@Entity('employee') // PARAM: name of the table
class Employee {
  @PrimaryGeneratedColumn()
  id?: number

  @Column()
  name: string

  @Column()
  email: string

  @Column({nullable: true})
  age?: number

  @OneToOne(() => Address, (address) => address.employee, {cascade: true})
  address?: Address

  @CreateDateColumn()
  createdAt?: Date

  @UpdateDateColumn()
  updatedAt?: Date

  @DeleteDateColumn()
  deletedAt?: Date
}

export default Employee
