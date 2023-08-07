import { ValidateIf } from 'class-validator'
import Department from '../entity/department.entity'

class EditDepartmentDto extends Department {
  @ValidateIf((obj) => obj.value !== undefined)
  name: string
}

export default EditDepartmentDto
