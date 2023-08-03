import Employee from '../entity/employee.entity'
import EmployeeRepository from '../repository/employee.repository'

class EmployeeService {
    constructor(private employeeRepository: EmployeeRepository) {}

    getAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.findAll()
    }

    getEmployeeById(id: number): Promise<Employee | null> {
        return this.employeeRepository.findById(id)
    }

    removeEmployeeById(id: number): Promise<Employee> {
        return this.employeeRepository.removeById(id)
    }

    addEmployee(name: string, email: string): Promise<Employee> {
        const newEmployee: Employee = {
            name: name,
            email: email
        }
        return this.employeeRepository.add(newEmployee)
    }

    async updateEmployeeById(id: number, name: string, email: string): Promise<Employee> {
        const employee = await this.getEmployeeById(id)
        if(employee) return this.employeeRepository.update({
            ...employee,
            name: name,
            email: email
        })
    }
}

export default EmployeeService