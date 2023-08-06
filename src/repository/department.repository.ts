import { Repository } from 'typeorm'
import Department from '../entity/department.entity'

class DepartmentRepository {
  constructor(private departmentRepositroy: Repository<Department>) {}

  public findALl = () => {}

  public findById = (id: number) => {}

  public add = (department: Department) => {}

  public update = (department: Department) => {}

  public remove = (department: Department) => {}
}

export default DepartmentRepository
