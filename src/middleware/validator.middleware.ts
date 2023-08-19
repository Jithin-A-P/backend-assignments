import { NextFunction, Response } from 'express'
import RequestWithUser from '../utils/request-with-user.interface'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import ValidationException from '../exception/validation.exception'

const validator = (DtoClass) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(DtoClass, req.body)
      const errors = await validate(dto)
      if (errors.length > 0) throw new ValidationException(errors)
      
      req.body = dto
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default validator