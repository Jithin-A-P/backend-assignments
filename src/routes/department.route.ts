import dataSource from '../db/postgres.db'
import Department from '../entity/department.entity'
import DepartmentService from '../service/department.service'
import DepartmentController from '../controller/department.controller'
import DepartmentRepository from '../repository/department.repository'

const departmentRepository = new DepartmentRepository(
  dataSource.getRepository(Department)
)
const departmentService = new DepartmentService(departmentRepository)
const departmentController = new DepartmentController(departmentService)
const departmentRoute = departmentController.router

export default departmentRoute
