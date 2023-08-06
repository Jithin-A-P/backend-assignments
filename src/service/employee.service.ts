import bcrypt, { hash } from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import Employee from '../entity/employee.entity'
import HttpException from '../exception/http.exception'
import EmployeeRepository from '../repository/employee.repository'
import LoginDto from '../dto/login.dto'

class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  public getAllEmployees = (): Promise<Employee[]> => {
    return this.employeeRepository.findAll()
  }

  public getEmployeeById = async (id: number): Promise<Employee> => {
    const employee = await this.employeeRepository.findById(id)
    if (!employee)
      throw new HttpException(404, `Error, employee not found with id: ${id}`)
    return employee
  }

  public removeEmployeeById = async (id: number): Promise<Employee> => {
    const employee = await this.employeeRepository.findById(id)
    return this.employeeRepository.remove(employee)
  }

  public addEmployee = async (employeeDto: Employee): Promise<Employee> => {
    const newEmployee = {
      ...employeeDto,
      password: await hash(employeeDto.password, 10),
    }
    return this.employeeRepository.add(newEmployee)
  }

  public updateEmployee = async (
    employeeDto: Employee
  ): Promise<Employee> => {
    const employee = await this.getEmployeeById(employeeDto.id)
    if (!employee)
      throw new HttpException(
        404,
        `Error, employee not found with id: ${employeeDto.id}`
      )
    const updatedAddress = employeeDto.address
    return this.employeeRepository.update({
      ...employee,
      ...employeeDto,
      password: await hash(employeeDto.password, 10),
      address: {
        ...employee.address,
        ...updatedAddress,
      },
    })
  }

  public loginEmployee = async (loginDto: LoginDto) => {
    const employee = await this.employeeRepository.findByEmail(loginDto.email)
    if (!employee) throw new HttpException(400, 'Employee not found')

    const loginStatus = await bcrypt.compare(
      loginDto.password,
      employee.password
    )
    if (!loginStatus)
      throw new HttpException(401, 'Incorrect username or password')

    const payload = {
      name: employee.name,
      email: employee.email,
      role: employee.role,
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
