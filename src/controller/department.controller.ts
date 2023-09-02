import { Router, Request, Response, NextFunction } from 'express'
import autheticate from '../middleware/authenticate.middleware'
import authorize from '../middleware/authorize.middleware'
import Role from '../utils/role.enum'
import DepartmentService from '../service/department.service'
import DepartmentDto from '../dto/department.dto'
import validator from '../middleware/validator.middleware'
import EditDepartmentDto from '../dto/edit-department.dto'
import HttpException from '../exception/http.exception'

class DepartmentController {
  public router: Router
  constructor(private departmentService: DepartmentService) {
    this.router = Router()
    this.router.get('/', autheticate, this.getAllDepartments)
    this.router.post(
      '/',
      autheticate,
      authorize([Role.ADMIN, Role.HR]),
      validator(DepartmentDto),
      this.addDepartment
    )
    this.router.get('/:id', autheticate, this.getDepartmentById)
    this.router.put(
      '/:id',
      autheticate,
      authorize([Role.ADMIN, Role.HR]),
      validator(DepartmentDto),
      this.updateDepartmentById
    )
    this.router.patch(
      '/:id',
      autheticate,
      authorize([Role.HR, Role.ADMIN]),
      validator(EditDepartmentDto),
      this.editDepartmentById
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

      res.status(200)
      res.locals.data = departments
      next()
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
      if (!Number.isInteger(departmentId))
        throw new HttpException(400, 'Bad Request, invalid department URL')

      const department = await this.departmentService.getDepartmentById(
        departmentId
      )
      res.status(200)
      res.locals.data = department

      next()
    } catch (error) {
      next(error)
    }
  }

  private editDepartmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const departmentId = Number(req.params.id)
      if (!Number.isInteger(departmentId))
        throw new HttpException(400, 'Bad Request, invalid department URL')

      const department = await this.departmentService.editDepartment(
        departmentId,
        req.body
      )
      res.status(200)
      res.locals.data = department

      next()
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
      const addedDepartment = await this.departmentService.addDepartment(
        req.body
      )

      res.status(201)
      res.locals.data = addedDepartment

      next()
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
      const departmentId = Number(req.params.id)
      if (!Number.isInteger(departmentId))
        throw new HttpException(400, 'Bad Request, invalid department URL')

      const updatedDepartment = await this.departmentService.updateDepartment(
        departmentId,
        req.body
      )

      res.status(200)
      res.locals.data = updatedDepartment

      next()
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
      const departmentId = Number(req.params.id)
      if (!Number.isInteger(departmentId))
        throw new HttpException(400, 'Bad Request, invalid department URL')

      await this.departmentService.removeDepartmentById(departmentId)
      res.status(204)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default DepartmentController
