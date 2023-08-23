import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, ValidateIf } from "class-validator";
import SubscriptionStatus from "../utils/subscription-status.enum";

class SubscriptionDto {
  @IsNotEmpty()
  @IsUUID()
  requestedBy: string;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsUUID()
  requestedTo?: string;

  @IsNotEmpty()
  @IsString()
  bookISBN: string;

  @IsNotEmpty()
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;
}

export default SubscriptionDto;
