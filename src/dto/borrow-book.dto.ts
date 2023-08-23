import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator'

class BorrowBookDto {
  @IsNotEmpty()
  @IsUUID()
  employeeId: string

  @IsNotEmpty()
  @IsString()
  shelfCode: string
}

export default BorrowBookDto
