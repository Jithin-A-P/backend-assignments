import { Repository } from 'typeorm'
import Department from '../entity/department.entity'

class DepartmentRepository {
  constructor(private departmentRepositroy: Repository<Department>) {}

  public findAll = (): Promise<Department[]> => {
    return this.departmentRepositroy.find()
  }

  public findById = (id: string): Promise<Department> => {
    return this.departmentRepositroy.findOne({
      where: { id: id },
    })
  }

  public findByIdWithEmployees = (id: string): Promise<Department> => {
    return this.departmentRepositroy.findOne({
      where: { id: id },
      relations: {
        employees: true
      }
    })
  }

  public add = (department: Department) => {
    return this.departmentRepositroy.save(department)
  }

  public update = (department: Department) => {
    return this.departmentRepositroy.save(department)
  }

  public remove = (department: Department) => {
    return this.departmentRepositroy.softRemove(department)
  }
}

export default DepartmentRepository
