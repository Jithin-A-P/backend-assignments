import { IsNotEmpty, IsString } from "class-validator"

class DepartmentDto {
  @IsNotEmpty()
  @IsString()
  name: string
}

export default DepartmentDto