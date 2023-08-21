import { IsNotEmpty, IsSemVer, IsString, ValidateIf } from "class-validator";

class EditShelfDto{
    @ValidateIf((obj) => obj.value !== undefined)
    @IsNotEmpty()
    @IsString()
    shelfCode: string

    @ValidateIf((obj) => obj.value !== undefined)
    @IsNotEmpty()
    @IsString()
    location: string
}

export default EditShelfDto;
