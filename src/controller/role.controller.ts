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
      res.status(200)
      res.locals = {
        data: Object.values(Role),
        errors: null,
        startTime: startTime
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default RoleController
