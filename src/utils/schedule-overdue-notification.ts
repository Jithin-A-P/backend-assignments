import dataSource from '../db/postgres.db'
import CronJob from '../entity/cron-job.entity'
import Notification from '../entity/notification.entity'
import CronJobRepository from '../repository/cron-job.repository'
import NotificationRepository from '../repository/notification.repository'
import CronService from '../service/cron.service'
import NotificationService from '../service/notification.service'
import logger from './winston.logger'

const schdeduleOverdueNotifications = () => {
  try {
    logger.log({
      level: 'info',
      message: 'Rescheduling all overdue notifications',
    })
    const cronJobRepository = new CronJobRepository(
      dataSource.getRepository(CronJob)
    )
    const notificationRepository = new NotificationRepository(
      dataSource.getRepository(Notification)
    )
    const notificationService = new NotificationService(notificationRepository)
    const cronService = new CronService(cronJobRepository, notificationService)

    cronService.scheduleAllNotifications()
  } catch (error) {
    logger.log({ level: 'error', message: error.message })
  }
}

export default schdeduleOverdueNotifications
