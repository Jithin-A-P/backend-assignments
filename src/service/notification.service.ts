import NotificationDto from "../dto/notification.dto";
import Notification from "../entity/notification.entity";
import NotFoundException from "../exception/not-found.exception";
import NotificationRepository from "../repository/notification.repository";

class NotificationService {
    constructor(private notificationRepository: NotificationRepository) {}

    public getNotification = (): Promise<Notification[]> => {
        return this.notificationRepository.findUnread();
    }

    public addNotification = (notification: NotificationDto):Promise<Notification> => {
        return this.notificationRepository.addNotification(notification as Notification)
    }

    public editNotification = async (id: number, notificationDto: Notification):Promise<Notification> => {
        const notification = await this.notificationRepository.findById(id);

        if(!notification)
        throw new NotFoundException(`Notification not found with id: ${id}`)

        notification.status = 'read';
        
        return this.notificationRepository.updateNotification(notification);
    }
}

export default NotificationService;