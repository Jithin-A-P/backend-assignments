import bcrypt, { hash } from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import Employee from '../entity/employee.entity'
import HttpException from '../exception/http.exception'
import EmployeeRepository from '../repository/employee.repository'
import LoginDto from '../dto/login.dto'
import NotFoundException from '../exception/not-found.exception'
import EditEmployeeDto from '../dto/edit-employee.dto'
import EmployeeDto from '../dto/employee.dto'
import BadRequestException from '../exception/bad-request.exception'

class EmployeeService {
  constructor(private employeeRepository: EmployeeRepository) {}

  public getAllEmployees = (
    rowsPerPage: number,
    pageNumber: number
  ): Promise<[Employee[], number]> => {
    const defaultRowsPerPage = 15
    const take = rowsPerPage || defaultRowsPerPage

    const rowsToSkip = (pageNumber - 1) * take
    const skip = rowsToSkip > 0 ? rowsToSkip : 0
    return this.employeeRepository.findAll(skip, take)
  }

  public getEmployeeById = async (id: number): Promise<Employee> => {
    const employee = await this.employeeRepository.findById(id)
    if (!employee)
      throw new NotFoundException(`Employee not found with id: ${id}`)

    employee.borrowedBooks = employee.borrowedBooks.map((borrowedBook) => {
      if (!borrowedBook.returnedAt)
        return borrowedBook.book
    }) 
    
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
        throw new BadRequestException(`Bad Request, ${key} is not expeted`)

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
    const employee = {
      ...employeeDto,
      password: await hash(employeeDto.password, 10),
    }

    const newEmployee = this.employeeRepository.add(employee)

    return newEmployee
  }

  public updateEmployee = async (
    id: number,
    employeeDto: EmployeeDto
  ): Promise<Employee> => {
    const employee = await this.getEmployeeById(id)

    if (!employee)
      throw new NotFoundException(`Employee not found with id: ${id}`)

    const updatedAddress = employeeDto.address

    const updatedEmployee = this.employeeRepository.update({
      ...employee,
      ...employeeDto,
      password: await hash(employeeDto.password, 10),
      address: {
        ...employee.address,
        ...updatedAddress,
      },
    })

    return updatedEmployee
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
      id: employee.id,
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
