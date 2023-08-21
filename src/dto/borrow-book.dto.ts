import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

class BorrowBookDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId: number

  @IsNotEmpty()
  @IsString()
  shelfCode: string
}

export default BorrowBookDto
