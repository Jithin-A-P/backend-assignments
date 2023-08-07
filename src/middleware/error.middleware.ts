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
    console.log(error.stack)
    if (error instanceof ValidationException) {
      res.statusMessage = HttpStatusMessages[`CODE_${error.status}`]
      res.status(error.status).send(error.errorPayload)
      return
    }
    if (error instanceof HttpException) {
      res.statusMessage = HttpStatusMessages[`CODE_${error.status}`]
      res.status(error.status).send({ error: error.message })
      return
    }
    res.statusMessage = HttpStatusMessages['CODE_500']
    res.status(500).send({ error: error.message })
  } catch (error) {
    next(error)
  }
}

export default errorMiddleware
