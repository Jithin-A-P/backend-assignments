import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator'
import NotificationStatus from '../utils/notification-status.enum'

class EditNotificationDto {
  @ValidateIf((obj) => obj.value !== undefined)
  @IsNotEmpty()
  @IsEnum(NotificationStatus)
  status: NotificationStatus
}

export default EditNotificationDto
