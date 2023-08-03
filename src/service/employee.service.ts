import Address from '../entity/address.entity'
import Employee from '../entity/employee.entity'
import HttpException from '../exception/http.exception'
import EmployeeRepository from '../repository/employee.repository'

class EmployeeService {
    constructor(private employeeRepository: EmployeeRepository) {}

    getAllEmployees(): Promise<Employee[]> {
        return this.employeeRepository.findAll()
    }

    async getEmployeeById(id: number): Promise<Employee | null> {
        const employee = await this.employeeRepository.findById(id)
        if(!employee)
            throw new HttpException(404, `Error, employee not found with id: ${id}`)
        return employee
    }

    async removeEmployeeById(id: number): Promise<Employee> {
        const employee = await this.employeeRepository.findById(id)
        return this.employeeRepository.remove(employee)
    }

    addEmployee(name: string, email: string, address: any): Promise<Employee> {
        const newEmployeeAddress = new Address()
        newEmployeeAddress.line1 = address.line1
        if(address.line2) newEmployeeAddress.line2 = address.line2
        newEmployeeAddress.pincode = address.pincode
        const newEmployee: Employee = {
            name: name,
            email: email,
            address: newEmployeeAddress
        }
        return this.employeeRepository.add(newEmployee)
    }

    async updateEmployeeById(id: number, name: string, email: string, address: any): Promise<Employee> {
        const employee = await this.getEmployeeById(id)
        if(employee) return this.employeeRepository.update({
            ...employee,
            name: name,
            email: email,
            address: {
                ...employee.address,
                line1: address.line1,
                line2: address.line2,
                pincode: address.pincode
            }
        })
    }
}

export default EmployeeService