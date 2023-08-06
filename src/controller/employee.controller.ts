import { Router, Request, Response, NextFunction } from 'express'
import EmployeeService from '../service/employee.service'
import { plainToInstance } from 'class-transformer'
import EmployeeDto from '../dto/employee.dto'
import { validate } from 'class-validator'
import ValidationException from '../exception/validation.exception'
import autheticate from '../middleware/authenticate.middleware'
import authorize from '../middleware/authorize.middleware'
import { Role } from '../utils/role.enum'
import Employee from '../entity/employee.entity'
import LoginDto from '../dto/login.dto'

class EmployeeController {
  public router: Router
  constructor(private employeeService: EmployeeService) {
    this.router = Router()
    this.router.get(
      '/', 
      autheticate, 
      this.getAllEmployees)
    this.router.post(
      '/',
      autheticate,
      authorize([Role.HR, Role.ADMIN]),
      this.addEmployee
    )
    this.router.get('/:id', this.getEmployeeById)
    this.router.put(
      '/:id',
      autheticate,
      authorize([Role.HR, Role.ADMIN]),
      this.updateEmployeeById
    )
    this.router.delete(
      '/:id',
      autheticate,
      authorize([Role.HR, Role.ADMIN]),
      this.removeEmployeeById
    )
    this.router.post('/login', this.loginEmployee)
  }

  private addEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const employeeDto = plainToInstance(EmployeeDto, req.body)
      const errors = await validate(employeeDto)
      if (errors.length > 0) throw new ValidationException(errors)
      const addedEmployee = await this.employeeService.addEmployee(
        employeeDto as Employee
      )
      res.status(201).send(addedEmployee)
    } catch (error) {
      next(error)
    }
  }

  private getAllEmployees = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const employees = await this.employeeService.getAllEmployees()
      res.status(200).send(employees)
    } catch (error) {
      next(error)
    }
  }

  private getEmployeeById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id)
      const employee = await this.employeeService.getEmployeeById(employeeId)
      res.status(200).send(employee)
    } catch (error) {
      next(error)
    }
  }

  private updateEmployeeById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const employeeDto = plainToInstance(EmployeeDto, {
        ...req.body,
        id: parseInt(req.params.id),
      })
      const errors = await validate(employeeDto)
      if (errors.length > 0) throw new ValidationException(errors)
      const updatedEmployee = await this.employeeService.updateEmployeeById(
        employeeDto as Employee
      )
      res.status(200).send(updatedEmployee)
    } catch (error) {
      next(error)
    }
  }

  private removeEmployeeById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id)
      await this.employeeService.removeEmployeeById(employeeId)
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }

  private loginEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const credentialsDto = plainToInstance(LoginDto, req.body)
      const errors = await validate(credentialsDto)
      if (errors.length > 0) throw new ValidationException(errors)
      const token = await this.employeeService.loginEmployee(credentialsDto)
      res.status(200).send({ data: token })
    } catch (error) {
      next(error)
    }
  }
}

export default EmployeeController
