import { Repository } from 'typeorm'
import Employee from '../entity/employee.entity'

class EmployeeRepository {
    constructor(private employeeRepository: Repository<Employee>) {}

    findAll(): Promise<Employee[]> {
        return this.employeeRepository.find()
    }

    findById(id: number): Promise<Employee> {
        return this.employeeRepository.findOneBy({
            id: id,
        })
    }
    
    removeById(id: number): Promise<Employee> {
        return this.employeeRepository.softRemove({
            id: id,
        })
    }

    add(employee: Employee): Promise<Employee> {
        return this.employeeRepository.save(employee)
    }

    update(employee: Employee): Promise<Employee> {
        return this.employeeRepository.save(employee)
    }
}

export default EmployeeRepository