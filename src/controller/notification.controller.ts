import { NextFunction, Request, Response, Router } from 'express'
import NotificationService from '../service/notification.service'
import EditNotificationDto from '../dto/edit-notification.dto'
import validateBody from '../middleware/validate-body.middleware'
import authenticate from '../middleware/authenticate.middleware'
import BadRequestException from '../exception/bad-request.exception'
import { isUUID } from 'class-validator'

class NotificationController {
  public router: Router
  constructor(private notificationService: NotificationService) {
    this.router = Router()
    this.router.get('/', authenticate, this.getNotifications)
    this.router.patch(
      '/:id',
      authenticate,
      validateBody(EditNotificationDto),
      this.editNotification
    )
  }

  private getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const employeeId = req.query.employeeId as string

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
      const notificationId = req.params.id
      if (!isUUID(notificationId))
        throw new BadRequestException('Invalid notification id')

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
