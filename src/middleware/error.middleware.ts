import { NextFunction, Request, Response } from 'express'
import HttpException from '../exception/http.exception'
import ValidationException from '../exception/validation.exception'

const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(error.stack)
        if(error instanceof ValidationException) {
            res.status(error.status).send(error.errorPayload)
            return
        }
        if(error instanceof HttpException) {
            res.status(error.status).send({error: error.message})
            return
        }
        res.status(500).send({error: error.message})
    } catch(error) {
        next(error)
    }
}

export default errorMiddleware