import { IsEmail, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import Address from '../entity/address.entity'
import AddressDto from './address.dto'

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
}

export default EmployeeDto
