import { Router, Request, Response, NextFunction } from 'express'
import EmployeeService from '../service/employee.service'
import { plainToInstance } from 'class-transformer'
import EmployeeDto from '../dto/employee.dto'
import { validate } from 'class-validator'
import ValidationException from '../exception/validation.exception'
import autheticate from '../middleware/authenticate.middleware'
import authorize from '../middleware/authorize.middleware'
import Role from '../utils/role.enum'
import Employee from '../entity/employee.entity'
import LoginDto from '../dto/login.dto'
import EditEmployeeDto from '../dto/edit-employee.dto'
import HttpException from '../exception/http.exception'

class EmployeeController {
  public router: Router
  constructor(private employeeService: EmployeeService) {
    this.router = Router()
    this.router.get('/', autheticate, this.getAllEmployees)
    this.router.post(
      '/',
      autheticate,
      authorize([Role.HR, Role.ADMIN]),
      this.addEmployee
    )
    this.router.get('/:id', autheticate, this.getEmployeeById)
    this.router.put(
      '/:id',
      autheticate,
      authorize([Role.HR, Role.ADMIN]),
      this.updateEmployeeById
    )
    this.router.patch(
      '/:id',
      autheticate,
      authorize([Role.HR, Role.ADMIN]),
      this.editEmployeeById
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
      const startTime = new Date().getTime()
      const employeeDto = plainToInstance(EmployeeDto, req.body)
      const errors = await validate(employeeDto)
      if (errors.length > 0) throw new ValidationException(errors)
      const addedEmployee = await this.employeeService.addEmployee(
        employeeDto as Employee
      )
      res.status(201)
      res.locals = {
        data: addedEmployee,
        errors: null,
        startTime: startTime,
      }
      next()
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
      const startTime = new Date().getTime()
      const employees = await this.employeeService.getAllEmployees()
      res.status(200)
      res.locals = {
        data: employees,
        errors: null,
        startTime: startTime,
      }
      next()
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
      const startTime = new Date().getTime()
      const employeeId = Number(req.params.id)
      if (!Number.isInteger(employeeId))
        throw new HttpException(400, 'Bad Request, invalid employee URL')
      const employee = await this.employeeService.getEmployeeById(employeeId)
      res.status(200)
      res.locals = {
        data: employee,
        errors: null,
        startTime: startTime,
      }
      next()
    } catch (error) {
      next(error)
    }
  }

  private editEmployeeById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const startTime = new Date().getTime()
      const employeeId = Number(req.params.id)
      if (!Number.isInteger(employeeId))
        throw new HttpException(400, 'Bad Request, invalid employee URL')
      const editEmployeeDto = plainToInstance(EditEmployeeDto, req.body)
      const errors = await validate(editEmployeeDto)
      if (errors.length > 0) throw new ValidationException(errors)
      const employee = await this.employeeService.editEmployee(
        employeeId,
        editEmployeeDto
      )
      res.status(200)
      res.locals = {
        data: employee,
        errors: null,
        startTime: startTime,
      }
      next()
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
      const startTime = new Date().getTime()
      const employeeId = Number(req.params.id)
      if (!Number.isInteger(employeeId))
        throw new HttpException(400, 'Bad Request, invalid employee URL')
      const employeeDto = plainToInstance(EmployeeDto, req.body)
      const errors = await validate(employeeDto)
      if (errors.length > 0) throw new ValidationException(errors)
      const updatedEmployee = await this.employeeService.updateEmployee(
        employeeDto as Employee,
        employeeId
      )
      res.status(200)
      res.locals = {
        data: updatedEmployee,
        errors: null,
        startTime: startTime,
      }
      next()
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
      if (!Number.isInteger(employeeId))
        throw new HttpException(400, 'Bad Request, invalid employee URL')
      await this.employeeService.removeEmployeeById(employeeId)
      res.status(204)
      next()
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
      const startTime = new Date().getTime()
      const credentialsDto = plainToInstance(LoginDto, req.body)
      const errors = await validate(credentialsDto)
      if (errors.length > 0) throw new ValidationException(errors)
      const token = await this.employeeService.loginEmployee(credentialsDto)
      res.status(200)
      res.locals = {
        data: token,
        errors: null,
        startTime: startTime,
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default EmployeeController
