import bcrypt, { hash } from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import Address from '../entity/address.entity'
import Employee from '../entity/employee.entity'
import HttpException from '../exception/http.exception'
import EmployeeRepository from '../repository/employee.repository'
import { Role } from '../utils/role.enum'

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

    async addEmployee(name: string, email: string, address: any, role: Role, password: string): Promise<Employee> {
        const newEmployeeAddress = new Address()
        newEmployeeAddress.line1 = address.line1
        if(address.line2) newEmployeeAddress.line2 = address.line2
        newEmployeeAddress.pincode = address.pincode
        const newEmployee = {
            name: name,
            email: email,
            address: newEmployeeAddress,
            role: role,
            password: await hash(password, 10),
        }
        return this.employeeRepository.add(newEmployee as Employee)
    }

    async updateEmployeeById(id: number, name: string, email: string, address: any): Promise<Employee> {
        const employee = await this.getEmployeeById(id)
        if(!employee) 
            throw new HttpException(404, `Error, employee not found with id: ${id}`)
        return this.employeeRepository.update({
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

    loginEmployee = async (email: string, password: string) => {
        const employee = await this.employeeRepository.findByEmail(email)
        if(!employee)
            throw new HttpException(400, 'Employee not found')

        const loginStatus = await bcrypt.compare(password, employee.password)
        if(!loginStatus)
            throw new HttpException(401, "Incorrect username or password")

        const payload = {
            name: employee.name,
            email: employee.email,
            role: employee.role
        }

        const token = jsonwebtoken.sign(
            payload, 
            process.env.JWT_SECRETE_KEY, 
            { expiresIn: process.env.JWT_EXPIRY_TIME }
        )

        return { token: token }
    }
}

export default EmployeeService