import { NextFunction, Request, Response } from 'express'
import HttpException from '../exception/http.exception'
import ValidationException from '../exception/validation.exception'
import logger from '../utils/winston.logger'
import HttpStatusMessages from '../utils/http-status-messages'

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    logger.log({
      level: 'error',
      message: `${res.locals.traceId} : ${error.message}`,
    })
    res.status(500)
    res.statusMessage = HttpStatusMessages['CODE_500']
    if (error instanceof ValidationException) {
      res.statusMessage = HttpStatusMessages[`CODE_${error.status}`]
      res.status(error.status).send(error.errorPayload)
      return
    }

    if (error instanceof HttpException) {
      res.status(error.status)
      res.statusMessage = HttpStatusMessages[`CODE_${error.status}`]
      res.locals.errors = error.message
    }
    
    res.send({ 
      data: null,
      error: res.locals.errors,
      message: res.statusMessage,
      meta: {
        took: new Date().getTime() - res.locals.startTime
      }
    })
  } catch (error) {
    next(error)
  }
}

export default errorMiddleware
