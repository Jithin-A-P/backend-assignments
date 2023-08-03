import Employee from '../entity/employee.entity'
import EmployeeRepository from '../repository/employee.repository'

class EmployeeService {
    private employeeRepository: EmployeeRepository

    constructor() {
        this.employeeRepository = new EmployeeRepository()
    }

    getAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.findAll()
    }

    getEmployeeById(id: number): Promise<Employee | null> {
        return this.employeeRepository.findById(id)
    }
}

export default EmployeeService