import BookController from '../controller/book.controller'
import dataSource from '../db/postgres.db'
import Book from '../entity/book.entity'
import BookRepository from '../repository/book.repository'
import BookService from '../service/book.service'
import BookShelfJnRepository from '../repository/book-shelf-jn.repository'
import BookShelfJn from '../entity/book-shelf-jn.entity'
import BorrowedBookRepository from '../repository/borrowed-book.repository'
import BorrowedBook from '../entity/borrowed-book.entity'
import NotificationRepository from '../repository/notification.repository'
import Notification from '../entity/notification.entity'
import SubscriptionRepository from '../repository/subscription.repository'
import Subscription from '../entity/subscription.entity'
import EmployeeRepository from '../repository/employee.repository'
import Employee from '../entity/employee.entity'
import NotificationService from '../service/notification.service'
import CronJobRepository from '../repository/cron-job.repository'
import CronJob from '../entity/cron-job.entity'
import CronService from '../service/cron.service'

const bookRepository = new BookRepository(dataSource.getRepository(Book))
const bookShelfJnRepository = new BookShelfJnRepository(
  dataSource.getRepository(BookShelfJn)
)
const borrowedBookRepository = new BorrowedBookRepository(
  dataSource.getRepository(BorrowedBook)
)
const notificationRepository = new NotificationRepository(
  dataSource.getRepository(Notification)
)
const notificationService = new NotificationService(
  notificationRepository
)
const subscriptionRepository = new SubscriptionRepository(
  dataSource.getRepository(Subscription)
)
const employeeRepository = new EmployeeRepository(
  dataSource.getRepository(Employee)
)
const cronJobRepository = new CronJobRepository(
  dataSource.getRepository(CronJob)
)
const cronService = new CronService(cronJobRepository, notificationService)

const bookService = new BookService(
  bookRepository,
  bookShelfJnRepository,
  borrowedBookRepository,
  subscriptionRepository,
  employeeRepository,
  notificationService,
  cronService
)
const bookController = new BookController(bookService)
const bookRoute = bookController.router

export default bookRoute
