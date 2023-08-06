import { Router, Request, Response, NextFunction } from 'express'
import autheticate from '../middleware/authenticate.middleware'
import authorize from '../middleware/authorize.middleware'
import Role from '../utils/role.enum'
import DepartmentService from '../service/department.service'

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
      // TODO: implement get
      res.send()
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
      // TODO: implement get one
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
      // TODO: implement post
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
      // TODO: implement put
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
      // TODO: implement delete
    } catch (error) {
      next(error)
    }
  }
}

export default DepartmentController