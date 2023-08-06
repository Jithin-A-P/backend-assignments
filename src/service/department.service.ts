import DepartmentRepository from '../repository/department.repository'

class DepartmentService {
  constructor(private departmentRepository: DepartmentRepository) {}

  public getAllDepartments = () => {}

  public addDepartment = () => {}

  public getDepartmentById = (id: number) => {}

  public removeDepartmentById = (id: number) => {}

  public updateDepartmentById = (id: number) => {}
}

export default DepartmentService
