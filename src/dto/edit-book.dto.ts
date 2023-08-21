import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsNumber,
  ValidateIf,
} from "class-validator";

class EditBookDto {
  @IsNotEmpty()
  @IsString()
  isbn: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  title: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  author: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  category: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  description: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  publisher: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsDateString()
  releaseDate: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  thumbnailUrl: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsNumber()
  totalCount: number;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsNumber()
  availableCount: number;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsString()
  shelfCode: string;
}

export default EditBookDto;
