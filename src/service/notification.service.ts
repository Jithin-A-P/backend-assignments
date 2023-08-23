import EditNotificationDto from '../dto/edit-notification.dto'
import Notification from '../entity/notification.entity'
import NotFoundException from '../exception/not-found.exception'
import NotificationRepository from '../repository/notification.repository'

class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  public getNotification = async (id: string): Promise<Notification[]> => {
    const notifications = await this.notificationRepository.findUnread(id)
    if (!notifications || notifications.length == 0) throw new NotFoundException('No notifications found')

    return notifications
  }

  public addNotification = async (
    notification: Notification
  ): Promise<Notification> => {
    return await this.notificationRepository.addNotification(notification)
  }

  public addNotifications = async (
    notifications: Notification[]
  ): Promise<Notification[]> => {
    return await this.notificationRepository.addNotifications(notifications)
  }

  public editNotification = async (
    id: string,
    editNotificationDto: EditNotificationDto
  ): Promise<Notification> => {
    const notification = await this.notificationRepository.findById(id)

    if (!notification)
      throw new NotFoundException(`Notification not found with id: ${id}`)

    notification.status = editNotificationDto.status

    return await this.notificationRepository.updateNotification(notification)
  }
}

export default NotificationService
