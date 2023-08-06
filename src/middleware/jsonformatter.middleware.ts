import { NextFunction, Request, Response } from 'express'
import HttpStatusMessages from '../utils/http-status-messages'

const jsonFormatter = (req: Request, res: Response, next: NextFunction) => {
  res.statusMessage =  HttpStatusMessages[`CODE_${res.statusCode}` ]
  console.log(HttpStatusMessages[`CODE_${res.statusCode}`])
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
  res.send(responseBody)
}

export default jsonFormatter