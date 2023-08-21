import { IsNotEmpty, IsString } from "class-validator";

class ShelfDto {
    @IsNotEmpty()
    @IsString()
    shelfCode: string

    @IsNotEmpty()
    @IsString()
    location: string

}

export default ShelfDto;