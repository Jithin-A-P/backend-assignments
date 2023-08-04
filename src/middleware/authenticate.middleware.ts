import { NextFunction, Request, Response } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import JwtPayload from '../utils/jwt-payload.type'
import RequestWithUser from '../utils/request-with-use.interface'

const autheticate = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const token = getTokenFromRequestHeader(req)
        const payload: JwtPayload = jsonwebtoken.verify(token, 'ABCDE') as JwtPayload
        req.name = payload.name
        req.email = payload.email
        req.role = payload.role
        next()
    } catch(error) {
        next(error)
    }
}

const getTokenFromRequestHeader = (req: Request) => {
    const bearerToken = req.header('Authorization')
    const token = bearerToken ? bearerToken.replace('Bearer ', '') : ''
    return token
}

export default autheticate