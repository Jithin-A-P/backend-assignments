import { IsNotEmpty, IsString } from 'class-validator'

class LendBookDto {
  @IsNotEmpty()
  @IsString()
  employeeId: number

  @IsNotEmpty()
  @IsString()
  shelfCode: string
}

export default LendBookDto
