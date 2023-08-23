import { NextFunction, Request, Response, Router } from 'express'
import NotificationService from '../service/notification.service'
import BadRequestException from '../exception/bad-request.exception'
import EditNotificationDto from '../dto/edit-notification.dto'
import validator from '../middleware/validator.middleware'
import autheticate from '../middleware/authenticate.middleware'

class NotificationController {
  public router: Router
  constructor(private notificationService: NotificationService) {
    this.router = Router()
    this.router.get('/', autheticate, this.getNotifications)
    this.router.patch(
      '/:id',
      autheticate,
      validator(EditNotificationDto),
      this.editNotification
    )
  }

  private getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const employeeId = Number(req.query.employeeId)
      
      const notifications = await this.notificationService.getNotification(
        employeeId
      )

      res.status(200)
      res.locals.data = notifications
      next()
    } catch (error) {
      next(error)
    }
  }

  private editNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const notificationId = Number(req.params.id)
      if (!Number.isInteger(notificationId))
        throw new BadRequestException('Bad Request, invalid notification URL')

      const editedNotification =
        await this.notificationService.editNotification(
          notificationId,
          req.body
        )

      res.status(200)
      res.locals.data = editedNotification
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default NotificationController
