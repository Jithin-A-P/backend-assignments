import {
  IsNotEmpty,
  ValidateIf,
  IsString,
  IsEmail,
  IsDateString,
  IsNumber,
  IsEnum,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import Role from '../utils/role.enum'
import Status from '../utils/status.enum'
import Address from '../entity/address.entity'
import AddressDto from './address.dto'

class EditEmployeeDto {
  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  name: string

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsDateString()
  joiningDate: string

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsNumber()
  experience: number

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsNumber()
  departmentId: number

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: Address
}

export default EditEmployeeDto
