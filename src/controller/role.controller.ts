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
      res.status(200).send(Object.values(Role))
    } catch (error) {
      next(error)
    }
  }
}

export default RoleController
