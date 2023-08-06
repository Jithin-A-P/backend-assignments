import { NextFunction, Request, Response } from 'express'
import logger from '../utils/winston.logger'
import { randomUUID } from 'crypto'

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.locals.traceId = randomUUID()
  logger.log({
    level: 'info',
    timeStamp: new Date(),
    traceId: res.locals.traceId,
    message: `${req.url} : ${req.method}`,
  })
  next()
}

export default loggerMiddleware
