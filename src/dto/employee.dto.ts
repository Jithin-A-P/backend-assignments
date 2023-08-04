import { IsEmail, IsEnum, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import Address from '../entity/address.entity'
import AddressDto from './address.dto'
import { Role } from '../utils/role.enum'

class EmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsObject()
    @ValidateNested({each: true})
    @Type(() => AddressDto)
    address: Address

    @IsNotEmpty()
    @IsString()
    password: string

    @IsNotEmpty()
    @IsEnum(Role)
    role: Role
}

export default EmployeeDto
