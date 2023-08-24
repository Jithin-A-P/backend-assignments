import CronJob from '../entity/cron-job.entity'
import CronJobRepository from '../repository/cron-job.repository'
import NodeSchedule from 'node-schedule'
import NotificationService from './notification.service'
import NotificationType from '../utils/notification-type.enum'
import NotificationStatus from '../utils/notification-status.enum'

class CronService {
  constructor(
    private cronJobRepository: CronJobRepository,
    private notificationService: NotificationService
  ) {}

  public addCronJob = async (cronJob: CronJob): Promise<CronJob> => {
    return await this.cronJobRepository.add(cronJob)
  }

  public removeCronJob = async (cronJob: CronJob): Promise<CronJob> => {
    return await this.cronJobRepository.remove(cronJob)
  }

  public getCronJob = async (
    employeeId: string,
    borrowedBookId: string
  ): Promise<CronJob> => {
    return await this.cronJobRepository.getOne(employeeId, borrowedBookId)
  }

  public scheduleAllNotifications = async () => {
    const cronJobs = await this.cronJobRepository.getAll()

    const scheduleNotification = (date: Date, cronJob: CronJob) => {
      NodeSchedule.scheduleJob(date, async () => {
        await this.notificationService.addNotification({
          type: NotificationType.OVERDUE,
          employeeId: cronJob.employeeId,
          status: NotificationStatus.UNREAD,
          content: `${cronJob.borrowedBook.book.title} is overdue, please return it at the earliest!!`,
        })
        this.cronJobRepository.remove(cronJob)
      })
    }

    cronJobs.forEach(async (cronJob) => {
      const BOOK_RENT_PERIOD = 2 // Months

      const borrowedAt = new Date()
      let dueMonth = borrowedAt.getUTCMonth() + BOOK_RENT_PERIOD
      let dueYear = borrowedAt.getUTCFullYear()

      dueYear = dueMonth > 12 ? dueYear + 1 : dueYear
      dueMonth = dueMonth % 12
      const dueDate = new Date()
      dueDate.setFullYear(dueYear)
      dueDate.setMonth(dueMonth)

      if (!cronJob.borrowedBook.returnedAt)
        scheduleNotification(dueDate, cronJob)
    })
  }
}

export default CronService
