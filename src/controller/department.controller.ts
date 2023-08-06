import { Router, Request, Response, NextFunction } from 'express'
import autheticate from '../middleware/authenticate.middleware'
import authorize from '../middleware/authorize.middleware'
import Role from '../utils/role.enum'
import DepartmentService from '../service/department.service'
import { plainToInstance } from 'class-transformer'
import DepartmentDto from '../dto/department.dto'
import { validate } from 'class-validator'
import ValidationException from '../exception/validation.exception'
import Department from '../entity/department.entity'

class DepartmentController {
  public router: Router
  constructor(private departmentService: DepartmentService) {
    this.router = Router()
    this.router.get('/', autheticate, this.getAllDepartments)
    this.router.post(
      '/',
      autheticate,
      authorize([Role.ADMIN, Role.HR]),
      this.addDepartment
    )
    this.router.get('/:id', autheticate, this.getDepartmentById)
    this.router.put(
      '/:id',
      autheticate,
      authorize([Role.ADMIN, Role.HR]),
      this.updateDepartmentById
    )
    this.router.delete(
      '/:id',
      autheticate,
      authorize([Role.ADMIN, Role.HR]),
      this.removeDepartmentById
    )
  }

  private getAllDepartments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const departments = await this.departmentService.getAllDepartments()
      res.status(200).send(departments)
    } catch (error) {
      next(error)
    }
  }

  private getDepartmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const departmentId = Number(req.params.id)
      const department = await this.departmentService.getDepartmentById(
        departmentId
      )
      res.status(200).send(department)
    } catch (error) {
      next(error)
    }
  }

  private addDepartment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const departmentDto = plainToInstance(DepartmentDto, req.body)
      const errors = await validate(departmentDto)
      if (errors.length > 0) throw new ValidationException(errors)
      const addedDepartment = await this.departmentService.addDepartment(
        departmentDto as Department
      )
      res.status(201).send(addedDepartment)
    } catch (error) {
      next(error)
    }
  }

  private updateDepartmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const departmentDto = plainToInstance(DepartmentDto, req.body)
      const errors = await validate(departmentDto)
      if (errors.length > 0) throw new ValidationException(errors)
      const updatedDepartment = await this.departmentService.updateDepartment(
        departmentDto as Department
      )
      res.status(200).send(updatedDepartment)
    } catch (error) {
      next(error)
    }
  }

  private removeDepartmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const employeeId = Number(req.params.id)
      await this.departmentService.removeDepartmentById(employeeId)
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}

export default DepartmentController
