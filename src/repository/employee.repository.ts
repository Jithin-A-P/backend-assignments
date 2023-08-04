import { Repository } from 'typeorm'
import Employee from '../entity/employee.entity'

class EmployeeRepository {
    constructor(private employeeRepository: Repository<Employee>) {}

    findAll(): Promise<Employee[]> {
        return this.employeeRepository.find({
            relations: {
                address: true,
            }
        })
    }

    findById(id: number): Promise<Employee> {
        return this.employeeRepository.findOne({
            where: {id: id},
            relations: {
                address: true,
            }
        })
    }

    findByEmail(email: string): Promise<Employee> {
        return this.employeeRepository.findOne({
            where: {email: email},
            relations: {
                address: true,
            }
        })
    }
    
    remove(employee: Employee): Promise<Employee> {
        return this.employeeRepository.softRemove(employee)
    }

    add(employee: Employee): Promise<Employee> {
        return this.employeeRepository.save(employee)
    }

    update(employee: Employee): Promise<Employee> {
        return this.employeeRepository.save(employee)
    }
}

export default EmployeeRepository