import { Repository } from "typeorm/repository/Repository"
import Notification from '../entity/notification.entity'
import NotificationStatus from "../utils/notification-status.enum"

class NotificationRepository {
    constructor(private notificationRepository: Repository<Notification>) {}
  
    public findAll = (): Promise<Notification[]> => {
      return this.notificationRepository.find()
    }

    public findById = (id: string): Promise<Notification> => {
        return this.notificationRepository.findOne({
            where: {id : id},
        })
    }

    public findUnread = (id): Promise<Notification[]> => {
        return this.notificationRepository.find({
            where: {
              employeeId: id,
                status: NotificationStatus.UNREAD
            }
          })
      }
  
    public addNotification = (notification: Notification): Promise<Notification> => {
      return this.notificationRepository.save(notification)
    }

    public addNotifications = (notifications: Notification[]): Promise<Notification[]> => {
      return this.notificationRepository.save(notifications)
    }
  
    public updateNotification = (notification: Notification): Promise<Notification> => {
      return this.notificationRepository.save(notification)
    }
  }
  
  export default NotificationRepository