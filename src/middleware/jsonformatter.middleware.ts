import { NextFunction, Request, Response } from 'express'
import HttpStatusMessages from '../utils/http-status-messages'
import logger from '../utils/winston.logger'

const jsonFormatter = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.statusMessage =  HttpStatusMessages[`CODE_${res.statusCode}` ]
    const responseBody = {
      data: res.locals.data,
      message: res.statusMessage,
      errors: res.locals.errors,
      meta: {
        length: res.locals.data.length || 1,
        took: new Date().getTime() - res.locals.startTime,
        total: res.locals.data.length || 1
      }
    }
    logger.log({
      level: 'info',
      timeStamp: new Date(),
      traceId: res.locals.traceId,
      message: `${req.url} : ${req.method} :  ${res.statusCode}`,
    })
    res.send(responseBody)
  } catch(error) {
    if(res.locals.errors.length > 0)
      res.locals.push(error)
    else 
      res.locals.errors = [error]
    next(error)
  }
}

export default jsonFormatter