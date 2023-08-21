import { IsNotEmpty, IsString, IsNumber } from 'class-validator'

class ShelfDetailsDto {
  @IsNotEmpty()
  @IsString()
  shelfCode: string

  @IsNotEmpty()
  @IsNumber()
  bookCount: number
}

export default ShelfDetailsDto

