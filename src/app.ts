import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/.env' })

import express from 'express'
import cors from 'cors'
import 'reflect-metadata'
import loggerMiddleware from './middleware/logger.middleware'
import dataSource from './db/postgres.db'
import employeeRoute from './routes/employee.route'
import errorMiddleware from './middleware/error.middleware'
import roleRoute from './routes/role.route'
import departmentRoute from './routes/department.route'
import jsonFormatter from './middleware/jsonformatter.middleware'
import logger from './utils/winston.logger'
import shelfRoute from './routes/shelf.route'
import bookRoute from './routes/book.route'

const server = express()
const PORT = process.env.PORT

server.use(cors())
server.use(express.json())
server.use(loggerMiddleware)
server.use('/api/employees', employeeRoute)
server.use('/api/departments', departmentRoute)
server.use('/api/roles', roleRoute)
server.use('/api/shelfs', shelfRoute)
server.use('/api/books', bookRoute)
server.use(jsonFormatter)
server.use(errorMiddleware)

dataSource
  .initialize()
  .then(() => {
    server.listen(PORT, () => {
      logger.log({ level: 'info', message: `Server started on port : ${PORT}` })
    })
  })
  .catch((error: Error) => {
    logger.log({
      level: 'error',
      message: `Error, can't connect to db ${error}`,
    })
  })
