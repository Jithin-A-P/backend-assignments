import { NextFunction, Request, Response, Router } from "express";
import NotificationService from "../service/notification.service";
import BadRequestException from "../exception/bad-request.exception";
import NotificationDto from "../dto/notification.dto";
import validator from '../middleware/validator.middleware'

class NotificationController {
    public router: Router;
    constructor(private notificationService: NotificationService) {
        this.router = Router()
        this.router.get('/', this.getNotifications)
        this.router.post('/', validator(NotificationDto),this.addNotifications)
        this.router.patch('/:id', this.editNotifications)
    }

    private getNotifications = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try{
            const notifications = await this.notificationService.getNotification();
            
            res.status(200);
            res.locals.data = notifications;
            next();
        }catch (error) {
            next(error)
        }
    }

    private addNotifications = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try{
            const addedNotifications = await this.notificationService.addNotification(
                req.body
            );
            
            res.status(200);
            res.locals.data = addedNotifications;
            next();
        }catch (error) {
            next(error)
        }
    }

    private editNotifications = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try{
            const notificationId = Number(req.params.id);
            if (!Number.isInteger(notificationId))
                throw new BadRequestException('Bad Request, invalid notification URL')
            const editedNotification = await this.notificationService.editNotification(
                notificationId,
                req.body
            );
            
            res.status(200);
            res.locals.data = editedNotification;
            next();
        }catch (error) {
            next(error)
        }
    }

}

export default NotificationController;