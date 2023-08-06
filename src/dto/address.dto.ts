import { IsNotEmpty, IsString } from 'class-validator'

class AddressDto {
    @IsNotEmpty()
    @IsString()
    line1: string

    @IsNotEmpty()
    @IsString()
    city: string

    @IsNotEmpty()
    @IsString()
    state: string

    @IsNotEmpty()
    @IsString()
    country: string

    @IsNotEmpty()
    @IsString()
    pincode: string
}

export default AddressDto