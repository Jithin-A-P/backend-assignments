import { DataSource } from 'typeorm'
import dataSource from '../db/postgres.db'
import Employee from '../entity/employee.entity'

class EmployeeRepository {
    private dataSource: DataSource

    constructor() {
        this.dataSource = dataSource
    }

    findAll(): Promise<Employee[]> {
        const employeeRepository = this.dataSource.getRepository(Employee)
        return employeeRepository.find()
    }

    findById(id: number): Promise<Employee> {
        const employeeRepository = this.dataSource.getRepository(Employee)
        return employeeRepository.findOneBy({
            id: id,
        })
    }
}

export default EmployeeRepository