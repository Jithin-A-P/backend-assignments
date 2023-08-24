import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  ValidateIf,
  IsArray,
  ValidateNested,
  IsEnum,
} from "class-validator";
import ShelfDetailsDto from "./shelf-details.dto";
import BookCategory from "../utils/book-category.enum";

class BookDto {
  @IsNotEmpty()
  @IsString()
  isbn: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsEnum(BookCategory)
  category: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  description: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  publisher: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsDateString()
  releaseDate: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsString()
  thumbnailUrl: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShelfDetailsDto)
  shelves: ShelfDetailsDto[];
}

export default BookDto;
