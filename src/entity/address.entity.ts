import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
  } from 'typeorm'
import Employee from './employee.entity'
import AbstractEntity from './absract.entiry'
  
  @Entity('address') // PARAM: name of the table
  class Address extends AbstractEntity {
    @Column()
    line1: string
  
    @Column({nullable: true})
    line2: string
  
    @Column()
    pincode: string

    @OneToOne(() => Employee, (employee) => employee.address)
    @JoinColumn()
    employee: Employee
  }
  
  export default Address
  