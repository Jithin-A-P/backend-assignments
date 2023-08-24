import { NextFunction, Request, Response, Router } from 'express'
import Role from '../utils/role.enum'
import authenticate from '../middleware/authenticate.middleware'

class RoleController {
  public router: Router

  constructor() {
    this.router = Router()
    this.router.get('/', authenticate, this.getRoles)
  }

  private getRoles = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals.data = Object.values(Role)
      res.status(200)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default RoleController
