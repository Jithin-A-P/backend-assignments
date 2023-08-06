import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/.env' })

import express from 'express'
import 'reflect-metadata'
import loggerMiddleware from './middleware/logger.middleware'
import dataSource from './db/postgres.db'
import employeeRoute from './routes/employee.route'
import errorMiddleware from './middleware/error.middleware'
import roleRoute from './routes/role.route'
import departmentRoute from './routes/department.route'

const server = express()
const PORT = process.env.PORT

server.use(express.json())
server.use(loggerMiddleware)
server.use('/api/employees', employeeRoute)
server.use('/api/departments', departmentRoute)
server.use('/api/roles', roleRoute)

server.use(errorMiddleware)

dataSource
  .initialize()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server started on port : ${PORT}`)
    })
  })
  .catch((err: Error) => {
    console.log("Error, can't connect to db : ", err)
  })
