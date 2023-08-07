import {
  ValidateIf,
} from 'class-validator'
import Role from '../utils/role.enum'
import Status from '../utils/status.enum'
import EmployeeDto from './employee.dto'
import Address from '../entity/address.entity'

class EditEmployeeDto extends EmployeeDto{
  @ValidateIf((obj) => obj.value !== undefined)
  name: string

  @ValidateIf((obj) => obj.value !== undefined)
  email: string

  @ValidateIf((obj) => obj.value !== undefined)
  password: string

  @ValidateIf((obj) => obj.value !== undefined)
  joiningDate: string

  @ValidateIf((obj) => obj.value !== undefined)
  experience: number

  @ValidateIf((obj) => obj.value !== undefined)
  role: Role

  @ValidateIf((obj) => obj.value !== undefined)
  status: Status

  @ValidateIf((obj) => obj.value !== undefined)
  departmentId: number

  @ValidateIf((obj) => obj.value !== undefined)
  address: Address
}

export default EditEmployeeDto
