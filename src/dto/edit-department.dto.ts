import { IsNotEmpty, IsString, ValidateIf } from 'class-validator'

class EditDepartmentDto {
  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  name: string
}

export default EditDepartmentDto
