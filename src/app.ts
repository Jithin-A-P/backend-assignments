import express from 'express'
import 'reflect-metadata'
import loggerMiddleware from './middleware/logger.middleware'
import dataSource from './db/postgres.db'
import employeeRoute from './routes/employee.route'

const server = express()
const PORT = 3000

server.use(express.json())
server.use(loggerMiddleware)
server.use('/employees', employeeRoute)

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
