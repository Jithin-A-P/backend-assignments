import express from 'express'
import employeeRouter from './routers/employee_router'
import loggerMiddleware from './middlewares/logger_middleware'

const server = express()
const PORT = 3000

server.use(express.json())
server.use(loggerMiddleware)
server.use('/employees', employeeRouter)

server.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`)
})
