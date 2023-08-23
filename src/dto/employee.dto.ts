import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import Address from '../entity/address.entity'
import AddressDto from './address.dto'
import Role from '../utils/role.enum'
import Status from '../utils/status.enum'

class EmployeeDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  @IsNotEmpty()
  @IsDateString()
  joiningDate: string

  @IsNumber()
  experience: number

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role

  @IsNotEmpty()
  @IsEnum(Status)
  status: Status

  @IsNotEmpty()
  @IsUUID()
  departmentId: string

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: Address
}

export default EmployeeDto
