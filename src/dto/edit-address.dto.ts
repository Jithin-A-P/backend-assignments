
import { ValidateIf, IsNotEmpty, IsString } from 'class-validator'

class EditAddressDto {
  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  line1: string

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  city: string

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  state: string

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  country: string

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  pincode: string
}

export default EditAddressDto
