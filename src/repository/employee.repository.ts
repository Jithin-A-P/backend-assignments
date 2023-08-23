import { Repository } from 'typeorm'
import Employee from '../entity/employee.entity'

class EmployeeRepository {
  constructor(private employeeRepository: Repository<Employee>) {}

  public findAll = (skip: number, take: number): Promise<[Employee[], number]> => {
    return this.employeeRepository.findAndCount({
      skip: skip,
      take: take,
    })
  }

  public findById = (id: string): Promise<Employee> => {
    return this.employeeRepository.findOne({
      where: { id: id },
      relations: {
        address: true,
        borrowedBooks: {
          book: true
        },
      },
    })
  }

  public findByEmail = (email: string): Promise<Employee> => {
    return this.employeeRepository.findOne({
      where: { email: email },
      relations: {
        address: true,
      },
    })
  }

  public remove = (employee: Employee): Promise<Employee> => {
    return this.employeeRepository.softRemove(employee)
  }

  public add = (employee: Employee): Promise<Employee> => {
    return this.employeeRepository.save(employee)
  }

  public update = (employee: Employee): Promise<Employee> => {
    return this.employeeRepository.save(employee)
  }
}

export default EmployeeRepository
