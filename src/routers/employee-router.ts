import express from 'express'
import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import Employee from '../models/employee'
import { dataSource } from '../data-source'

const employeeRouter = express.Router()


const employees: Employee[] = [
  {
    id: 1,
    name: "Bratah Chandran",
    email: "barathchandran001@gmail.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    name: "Vishnav N T",
    email: "vishnavnt@gmail.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

let c: number = employees.length

employeeRouter.get('/', (req, res) => {
  res.status(200).send(employees)
})

employeeRouter.post('/', (req, res) => {
  const newEmployee: Employee = {
    id: ++c,
    name: req.body.name,
    email: req.body.email,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  employees.push(newEmployee)
  res.status(201).send(newEmployee)
})

employeeRouter.get('/:id', async (req, res) => {
  const employeeRepository = dataSource.getRepository(Employee)
  const employee = await employeeRepository.findOneBy({id: parseInt(req.params.id)})

  res.status(200).send(employee)
})

employeeRouter.put('/:id', (req, res) => {
  let employee: Employee = employees.find((e: Employee) => e.id == parseInt(req.params.id))
  employee = {
    ...employee,
    name: req.body.name,
    email: req.body.email,
    updatedAt: new Date()
  }
  res.status(200).send(employee)
})

employeeRouter.delete('/:id', (req, res) => {
  const employeeIdx: number =  employees.findIndex((e: Employee) => e.id == parseInt(req.params.id))
  employees.splice(employeeIdx, 1)
  res.status(200).send('Deleted')
})

export default employeeRouter
