
import { ValidateIf } from 'class-validator'
import AddressDto from './address.dto'

class EditAddressDto extends AddressDto{
  @ValidateIf((obj) => obj.value !== undefined)
  line1: string

  @ValidateIf((obj) => obj.value !== undefined)
  city: string

  @ValidateIf((obj) => obj.value !== undefined)
  state: string

  @ValidateIf((obj) => obj.value !== undefined)
  country: string

  @ValidateIf((obj) => obj.value !== undefined)
  pincode: string
}

export default EditAddressDto
