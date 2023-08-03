import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import Address from '../entity/address.entity'
import CreateAddressDto from './create-address.dto'

class CreateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateAddressDto)
    address: Address
}

export default CreateEmployeeDto