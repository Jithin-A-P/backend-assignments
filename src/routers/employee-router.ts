import express from 'express'
import Employee from '../models/employee'
import dataSource from '../data-source'

const employeeRouter = express.Router()
const employeeRepository = dataSource.getRepository(Employee)

employeeRouter.get('/', async (req, res) => {
  const nameFilter = req.query.name
  const emailFilter = req.query.email

  const queryBuilder = employeeRepository.createQueryBuilder()

  if(nameFilter)
    queryBuilder.andWhere('name LIKE :name', {name: `${nameFilter}%`})

  if(emailFilter)
    queryBuilder.andWhere('email LIKE :email', {email: `%${emailFilter}%`})
  
  const employees = await queryBuilder.getMany()
  res.status(200).send(employees)
})

employeeRouter.post('/', (req, res) => {
  const newEmployee: Employee = {
    name: req.body.name,
    email: req.body.email
  }
  employeeRepository.save(newEmployee)
  res.status(201).send(newEmployee)
})

employeeRouter.get('/:id', async (req, res) => {
  const employee = await employeeRepository.findOneBy({id: parseInt(req.params.id)})
  res.status(200).send(employee)
})

employeeRouter.put('/:id', async (req, res) => {
  const employee: Employee = await employeeRepository.findOneBy({id: parseInt(req.params.id)})
  const editedEmployee = await employeeRepository.save({
    ...employee,
    name: req.body.name,
    email: req.body.email
  })
  res.status(200).send(editedEmployee)
})

employeeRouter.delete('/:id', (req, res) => {
  employeeRepository.softRemove({id: parseInt(req.params.id)})
  res.status(200).send('Deleted')
})

export default employeeRouter
