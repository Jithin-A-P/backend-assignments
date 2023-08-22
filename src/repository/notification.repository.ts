import { Repository } from "typeorm/repository/Repository"
import Notification from '../entity/notification.entity'

class NotificationRepository {
    constructor(private notificationRepository: Repository<Notification>) {}
  
    public findAll = (): Promise<Notification[]> => {
      return this.notificationRepository.find()
    }

    public findById = (id: number): Promise<Notification> => {
        return this.notificationRepository.findOne({
            where: {id : id},
        })
    }

    public findUnread = (id): Promise<Notification[]> => {
        return this.notificationRepository.find({
            where: {
              employeeId: id,
                status: 'unread'
            }
          })
      }
  
    public addNotification = (notification: Notification): Promise<Notification> => {
      return this.notificationRepository.save(notification)
    }
  
    public updateNotification = (notification: Notification): Promise<Notification> => {
      return this.notificationRepository.save(notification)
    }
  }
  
  export default NotificationRepository