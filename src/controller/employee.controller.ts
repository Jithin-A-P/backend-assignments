import { Router, Request, Response, NextFunction } from 'express'
import EmployeeService from '../service/employee.service'
import EmployeeDto from '../dto/employee.dto'
import autheticate from '../middleware/authenticate.middleware'
import authorize from '../middleware/authorize.middleware'
import validator from '../middleware/validator.middleware'
import Role from '../utils/role.enum'
import LoginDto from '../dto/login.dto'
import EditEmployeeDto from '../dto/edit-employee.dto'
import BadRequestException from '../exception/bad-request.exception'

class EmployeeController {
  public router: Router
  constructor(private employeeService: EmployeeService) {
    this.router = Router()
    this.router.get('/', autheticate, this.getAllEmployees)
    this.router.post(
      '/',
      autheticate,
      authorize([Role.HR, Role.ADMIN]),
      validator(EmployeeDto),
      this.addEmployee
    )
    this.router.get('/:id', autheticate, this.getEmployeeById)
    this.router.put(
      '/:id',
      autheticate,
      authorize([Role.HR, Role.ADMIN]),
      validator(EmployeeDto),
      this.updateEmployeeById
    )
    this.router.patch(
      '/:id',
      autheticate,
      authorize([Role.HR, Role.ADMIN]),
      validator(EditEmployeeDto),
      this.editEmployeeById
    )
    this.router.delete(
      '/:id',
      autheticate,
      authorize([Role.HR, Role.ADMIN]),
      this.removeEmployeeById
    )
    this.router.post('/login', validator(LoginDto), this.loginEmployee)
  }

  private addEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const addedEmployee = await this.employeeService.addEmployee(req.body)

      res.status(201)
      res.locals.data = addedEmployee
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
      const rowsPerPage = Number(req.query.rowsPerPage)
      const pageNumber = Number(req.query.pageNumber)

      const employees = await this.employeeService.getAllEmployees(
        rowsPerPage,
        pageNumber
      )

      res.status(200)
      res.locals.data = employees
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
      const employeeId = Number(req.params.id)
      if (!Number.isInteger(employeeId))
        throw new BadRequestException('Bad Request, invalid employee URL')

      const employee = await this.employeeService.getEmployeeById(employeeId)
      res.status(200)
      res.locals.data = employee
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
      const employeeId = Number(req.params.id)
      if (!Number.isInteger(employeeId))
        throw new BadRequestException('Bad Request, invalid employee URL')

      const employee = await this.employeeService.editEmployee(
        employeeId,
        req.body
      )

      res.status(200)
      res.locals.data = employee
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
      const employeeId = Number(req.params.id)
      if (!Number.isInteger(employeeId))
        throw new BadRequestException('Bad Request, invalid employee URL')

      const updatedEmployee = await this.employeeService.updateEmployee(
        employeeId,
        req.body
      )

      res.status(200)
      res.locals.data = updatedEmployee
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
        throw new BadRequestException('Bad Request, invalid employee URL')

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
      const token = await this.employeeService.loginEmployee(req.body)

      res.status(200)
      res.locals.data = token
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default EmployeeController
