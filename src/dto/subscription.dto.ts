import { IsEnum, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator";
import SubscriptionStatus from "../utils/subscription.status.enum";

class SubscriptionDto {
  @IsNotEmpty()
  @IsNumber()
  requestedBy: number;

  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsNumber()
  requestedTo?: number;

  @IsNotEmpty()
  @IsString()
  bookISBN: string;

  @IsNotEmpty()
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;
}

export default SubscriptionDto;
