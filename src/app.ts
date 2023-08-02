import express from 'express'
import 'reflect-metadata'
import employeeRouter from './routers/employee-router'
import loggerMiddleware from './middlewares/logger-middleware'
import dataSource from './data-source'

const server = express()
const PORT = 3000

server.use(express.json())
server.use(loggerMiddleware)
server.use('/employees', employeeRouter)

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
