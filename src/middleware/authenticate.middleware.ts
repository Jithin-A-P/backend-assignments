import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const autheticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = getTokenFromRequestHeader(req)
        jwt.verify(token, 'ABCDE')
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