import express from 'express'
import Employee from '../models/employee'

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
    id: c++,
    name: req.body.name,
    email: req.body.email,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  employees.push(newEmployee)
  res.status(201).json(newEmployee)
})

employeeRouter.get('/:id', (req, res) => {
  let employee = employees.find((e: Employee) => e.id == parseInt(req.params.id))
  res.status(200).send(employee)
})

export default employeeRouter
