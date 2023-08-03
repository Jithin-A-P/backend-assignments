import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm'
import Employee from './employee.entity'
  
  @Entity('address') // PARAM: name of the table
  class Address {
    @PrimaryGeneratedColumn()
    id?: number
  
    @Column()
    line1: string
  
    @Column({nullable: true})
    line2?: string
  
    @Column()
    pincode: string
  
    @CreateDateColumn()
    createdAt?: Date
  
    @UpdateDateColumn()
    updatedAt?: Date
  
    @DeleteDateColumn()
    deletedAt?: Date

    @OneToOne(() => Employee, (employee) => employee.address)
    @JoinColumn()
    employee: Employee
  }
  
  export default Address
  