import bcrypt, { hash } from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import Employee from '../entity/employee.entity'
import HttpException from '../exception/http.exception'
import EmployeeRepository from '../repository/employee.repository'
import LoginDto from '../dto/login.dto'
import NotFoundException from '../exception/not-found.exception'
import EditEmployeeDto from '../dto/edit-employee.dto'
import EmployeeDto from '../dto/employee.dto'

class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  public getAllEmployees = (): Promise<Employee[]> => {
    return this.employeeRepository.findAll()
  }

  public getEmployeeById = async (id: number): Promise<Employee> => {
    const employee = await this.employeeRepository.findById(id)
    if (!employee)
      throw new NotFoundException(`Employee not found with id: ${id}`)
    return employee
  }

  public editEmployee = async (
    id: number,
    editEmployeeDto: EditEmployeeDto
  ): Promise<Employee> => {
    const employee = await this.employeeRepository.findById(id)

    if (!employee)
      throw new NotFoundException(`Employee not found with id: ${id}`)

    for (const key in editEmployeeDto)
      if (!(key in employee))
        throw new HttpException(
          400,
          'Bad Request, received body contains invalid keys'
        )

    const editedEmployee = await this.employeeRepository.update({
      ...employee,
      ...editEmployeeDto,
      address: {
        ...employee.address,
        ...editEmployeeDto?.address,
      },
    })
    return editedEmployee
  }

  public removeEmployeeById = async (id: number): Promise<Employee> => {
    const employee = await this.employeeRepository.findById(id)
    return this.employeeRepository.remove(employee)
  }

  public addEmployee = async (employeeDto: EmployeeDto): Promise<Employee> => {
    const newEmployee = {
      ...employeeDto,
      password: await hash(employeeDto.password, 10),
    }
    return this.employeeRepository.add(newEmployee)
  }

  public updateEmployee = async (
    id: number,
    employeeDto: EmployeeDto
  ): Promise<Employee> => {
    const employee = await this.getEmployeeById(id)
    if (!employee)
      throw new NotFoundException(`Employee not found with id: ${id}`)
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
    if (!employee)
      throw new HttpException(401, 'Incorrect username or password')

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

    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRETE_KEY, {
      expiresIn: process.env.JWT_EXPIRY_TIME,
    })

    return { token: token }
  }
}

export default EmployeeService
