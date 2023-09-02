import DepartmentDto from '../dto/department.dto'
import EditDepartmentDto from '../dto/edit-department.dto'
import Department from '../entity/department.entity'
import HttpException from '../exception/http.exception'
import NotFoundException from '../exception/not-found.exception'
import DepartmentRepository from '../repository/department.repository'

class DepartmentService {
  constructor(private departmentRepository: DepartmentRepository) {}

  public getAllDepartments = (): Promise<Department[]> => {
    return this.departmentRepository.findAll()
  }

  public addDepartment = (
    departmentDto: DepartmentDto
  ): Promise<Department> => {
    return this.departmentRepository.add(departmentDto as Department)
  }

  public getDepartmentById = async (id: number): Promise<Department> => {
    const department = await this.departmentRepository.findById(id)
    if (!department)
      throw new NotFoundException(`Department not found with id: ${id}`)
    return department
  }

  public editDepartment = async (
    id: number,
    editDepartmentDto: EditDepartmentDto
  ): Promise<Department> => {
    const department = await this.departmentRepository.findById(id)

    if (!department)
      throw new NotFoundException(`Department not found with id: ${id}`)

    for (const key in editDepartmentDto)
      if (!(key in department)) throw new HttpException(400, 'Bad Request')

    const editedDepartment = await this.departmentRepository.update({
      ...department,
      ...editDepartmentDto,
    })

    return editedDepartment
  }

  public removeDepartmentById = async (id: number): Promise<Department> => {
    const department = await this.departmentRepository.findByIdWithEmployees(id)

    if (!department)
      throw new NotFoundException(`Department not found with id: ${id}`)

    if (department.employees.length > 0)
      throw new HttpException(400, 'Cannot delete department with employees')

    return this.departmentRepository.remove(department)
  }

  public updateDepartment = async (
    id: number,
    departmentDto: Department
  ): Promise<Department> => {
    const department = await this.departmentRepository.findById(id)
    if (!department)
      throw new NotFoundException(`Department not found with id: ${id}`)

    return this.departmentRepository.update({
      ...department,
      ...departmentDto,
    })
  }
}

export default DepartmentService
