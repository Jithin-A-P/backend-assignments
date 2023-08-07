import { NextFunction, Request, Response, Router } from 'express'
import Role from '../utils/role.enum'
import autheticate from '../middleware/authenticate.middleware'

class RoleController {
  public router: Router

  constructor() {
    this.router = Router()
    this.router.get('/', autheticate, this.getRoles)
  }

  private getRoles = (req: Request, res: Response, next: NextFunction) => {
    try {
      const startTime = new Date().getTime()
      res.locals = {
        data: Object.values(Role),
        errors: null,
        startTime: startTime
      }
      res.status(200)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default RoleController
