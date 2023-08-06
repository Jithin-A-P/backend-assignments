import Department from '../entity/department.entity'
import HttpException from '../exception/http.exception'
import DepartmentRepository from '../repository/department.repository'

class DepartmentService {
  constructor(private departmentRepository: DepartmentRepository) {}

  public getAllDepartments = (): Promise<Department[]> => {
    return this.departmentRepository.findAll()
  }

  public addDepartment = (department: Department): Promise<Department> => {
    return this.departmentRepository.add(department)
  }

  public getDepartmentById = async (id: number): Promise<Department> => {
    const department = await this.departmentRepository.findById(id)
    if(!department)
      throw new HttpException(404, `Error, department not found with id: ${id}`)
    return department
  }

  public removeDepartmentById = async (id: number): Promise<Department> => {
    const department = await this.departmentRepository.findById(id)
    if(!department)
      throw new HttpException(404, `Error, department not found with id: ${id}`)
    return this.departmentRepository.remove(department)
  }

  public updateDepartment = async (departmentDto: Department): Promise<Department> => {
    const department = await this.departmentRepository.findById(departmentDto.id)
    if(!department)
      throw new HttpException(404, `Error, department not found with id: ${departmentDto.id}`)
    return this.departmentRepository.update({
      ...department,
      ...departmentDto
    })
  }
}

export default DepartmentService
