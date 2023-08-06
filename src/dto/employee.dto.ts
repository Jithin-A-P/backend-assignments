import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import Address from '../entity/address.entity'
import AddressDto from './address.dto'
import Role from '../utils/role.enum'

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

  @IsNumber()
  experience: number

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role

  @IsNotEmpty()
  @IsNumber()
  department: number

  @IsNotEmpty()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  address: Address
}

export default EmployeeDto
