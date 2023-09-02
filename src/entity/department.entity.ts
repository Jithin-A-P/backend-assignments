import { Column, Entity, JoinColumn, OneToMany } from 'typeorm'
import AbstractEntity from './absract.entity'
import Employee from './employee.entity'

@Entity('department')
class Department extends AbstractEntity {
  @Column()
  name: string

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[]
}

export default Department
