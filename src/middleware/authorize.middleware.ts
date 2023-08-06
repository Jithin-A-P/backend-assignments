import { NextFunction, Response } from 'express'
import RequestWithUser from '../utils/request-with-user.interface'
import HttpException from '../exception/http.exception'
import Role from '../utils/role.enum'

const authorize = (roles: Role[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      if (!roles.includes(req.role))
        throw new HttpException(
          403,
          'You are not authorized to perform this action'
        )
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default authorize
