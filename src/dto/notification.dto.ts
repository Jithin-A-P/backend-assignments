import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator"
import NotificationStatus from "../utils/notification-status.enum"
import NotificationType from "../utils/notification-type.enum"

class NotificationDto {
  @IsNotEmpty()
  @IsNumber()
  employeeId: number

  @IsNotEmpty()
  @IsString()
  bookIsbn: string

  @IsNotEmpty()
  @IsEnum(NotificationStatus)
  status: NotificationStatus

  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType

  @IsNotEmpty()
  @IsString()
  content: string
    
}

export default NotificationDto

