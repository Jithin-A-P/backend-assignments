import xlsx from 'xlsx'
import { ILike, IsNull, MoreThan } from 'typeorm'
import { plainToInstance } from 'class-transformer'
import { UploadedFile } from 'express-fileupload'
import { validate } from 'class-validator'
import NotFoundException from '../exception/not-found.exception'
import BookDto from '../dto/book.dto'
import BookRepository from '../repository/book.repository'
import BookShelfJnRepository from '../repository/book-shelf-jn.repository'
import Book from '../entity/book.entity'
import BorrowedBookRepository from '../repository/borrowed-book.repository'
import BorrowBookDto from '../dto/borrow-book.dto'
import BorrowedBook from '../entity/borrowed-book.entity'
import BadRequestException from '../exception/bad-request.exception'
import SubscriptionDto from '../dto/subscription.dto'
import Subscription from '../entity/subscription.entity'
import SubscriptionRepository from '../repository/subscription.repository'
import Notification from '../entity/notification.entity'
import EmployeeRepository from '../repository/employee.repository'
import NotificationStatus from '../utils/notification-status.enum'
import NotificationType from '../utils/notification-type.enum'
import NotificationService from './notification.service'
import SubscriptionStatus from '../utils/subscription-status.enum'
import ValidationException from '../exception/validation.exception'
import CronService from './cron.service'

class BookService {
  constructor(
    private bookRepository: BookRepository,
    private bookShelfJnRepository: BookShelfJnRepository,
    private borrowedBookRepository: BorrowedBookRepository,
    private subscriptionRepository: SubscriptionRepository,
    private employeeRepository: EmployeeRepository,
    private notificationService: NotificationService,
    private cronService: CronService
  ) {}

  public getAllBooks = (
    rowsPerPage: number,
    pageNumber: number,
    searchQuery: string,
    category: string,
    available: string
  ): Promise<[Book[], number]> => {
    const defaultRowsPerPage = 15
    const take = rowsPerPage || defaultRowsPerPage

    const rowsToSkip = (pageNumber - 1) * take
    const skip = rowsToSkip > 0 ? rowsToSkip : 0

    const filters = {}

    if (category) filters['category'] = ILike(`%${category}%`)

    if (available == 'true') filters['availableCount'] = MoreThan(0)

    const searchFilter = [
      { ...filters, isbn: ILike(`%${searchQuery || '%'}%`) },
      { ...filters, title: ILike(`%${searchQuery || '%'}%`) },
      { ...filters, author: ILike(`%${searchQuery || '%'}%`) },
    ]

    return this.bookRepository.findAll(skip, take, searchFilter)
  }

  public getBookById = async (id: string): Promise<Book> => {
    const book = await this.bookRepository.findById(id, true)
    if (!book) throw new NotFoundException(`Book not found with id: ${id}`)

    const { bookShelfJns } = book
    delete book['bookShelfJns']

    const { borrowedBooks } = book
    delete book['borrowedBooks']

    book.shelves = bookShelfJns.map((bookShelfJn) => ({
      ...bookShelfJn.shelf,
      availableBookCount: bookShelfJn.bookCount,
    }))

    book.borrowedBy = borrowedBooks.map((borrowedBook) => borrowedBook.employee)

    return book
  }

  public addBook = async (bookDto: BookDto): Promise<Book> => {
    const { shelves } = bookDto
    delete bookDto['shelves']

    const totalCount = shelves.reduce(
      (total, shelf) => total + shelf.bookCount,
      0
    )

    let addedBook = null
    try {
      addedBook = await this.bookRepository.addBook({
        ...(bookDto as any),
        totalCount: totalCount,
        availableCount: totalCount,
      })

      await this.bookShelfJnRepository.addEntries(
        shelves.map((shelf) => ({
          ...shelf,
          bookIsbn: bookDto.isbn,
        }))
      )

      return addedBook
    } catch (error) {
      const isbnAlreadyExists = /(isbn)[\s\S]+(already exists)/.test(
        error.detail
      )

      if (isbnAlreadyExists)
        throw new BadRequestException(
          `Book with ISBN ${bookDto.isbn} already exists`
        )

      const shelfDoesNotExists =
        /(shelf_code)[\s\S]+(is not present in table)/.test(error.detail)

      if (shelfDoesNotExists) {
        if (addedBook)
          await this.bookRepository.updateBook({
            ...addedBook,
            totalCount: 0,
            availableCount: 0,
          })

        throw new BadRequestException(
          `Invalid shelf code given, no shelves assigned to book`
        )
      }
      throw error
    }
  }

  public bulkAddBook = async (file: UploadedFile): Promise<Book[]> => {
    const data = xlsx.read(file.data)
    const sheet = data.Sheets[data.SheetNames[0]]
    const booksData = xlsx.utils.sheet_to_json(sheet, {
      defval: null,
    })

    console.log(booksData)

    const bookShelfJnEntries = []
    const bookEntries = []

    await Promise.all(
      booksData.map(async (bookData) => {
        const {
          Title: title,
          Author: author,
          ISBN: isbn,
          Category: category,
          Description: description,
          Publisher: publisher,
          'Release Date': releaseDate,
          ...shelvesData
        } = bookData as any

        const bookShelfJnEntry = Object.keys(shelvesData).map((shelfCode) => ({
          shelfCode: shelfCode,
          bookCount: shelvesData[shelfCode] || 0,
          bookIsbn: isbn,
        }))

        const totalCount = bookShelfJnEntry.reduce(
          (total, shelf) => total + shelf.bookCount,
          0
        )

        const bookEntry = {
          title: title,
          author: author,
          isbn: isbn,
          category: category,
          description: description,
          publisher: publisher,
          releaseDate: releaseDate,
          totalCount: totalCount,
          availableCount: totalCount,
        }

        const bookDto = plainToInstance(BookDto, {
          ...bookEntry,
          shelves: bookShelfJnEntry,
        })

        const errors = await validate(bookDto)
        if (errors.length > 0) throw new ValidationException(errors)

        bookEntries.push(bookEntry)
        bookShelfJnEntries.push(...bookShelfJnEntry)
      })
    )

    const addedBooks = await this.bookRepository.addBooks(bookEntries)
    await this.bookShelfJnRepository.addEntries(bookShelfJnEntries)

    return addedBooks
  }

  public updateBook = async (id: string, bookDto: BookDto): Promise<Book> => {
    const currentBook = await this.bookRepository.findById(id, false)
    if (!currentBook)
      throw new NotFoundException(`Book not found with id: ${id}`)

    const { shelves: updatedShelves } = bookDto
    delete bookDto['shelves']

    const availableCount = updatedShelves.reduce(
      (total, shelf) => total + shelf.bookCount,
      0
    )

    const availableCountDifference = availableCount - currentBook.availableCount

    const totalCount = currentBook.totalCount + availableCountDifference

    try {
      const updatedBook = await this.bookRepository.updateBook({
        ...currentBook,
        ...(bookDto as any),
        totalCount: totalCount,
        availableCount: availableCount,
      })

      const currentShelfEntries =
        await this.bookShelfJnRepository.getAllEntries(updatedBook.isbn)

      const updatedShelfEntries = updatedShelves.map((updatedShelf) => ({
        ...currentShelfEntries.find(
          (currentShelfEntry) =>
            currentShelfEntry.shelfCode === updatedShelf.shelfCode
        ),
        ...updatedShelf,
        bookIsbn: bookDto.isbn,
      }))

      await this.bookShelfJnRepository.addEntries([
        ...currentShelfEntries,
        ...updatedShelfEntries,
      ])

      return updatedBook
    } catch (error) {
      const isbnAlreadyExists = /(isbn)[\s\S]+(already exists)/.test(
        error.detail
      )

      if (isbnAlreadyExists)
        throw new BadRequestException(`Book id and ISBN does not match`)

      const shelfDoesNotExists =
        /(shelf_code)[\s\S]+(is not present in table)/.test(error.detail)

      if (shelfDoesNotExists) {
        await this.bookRepository.updateBook(currentBook)
        throw new BadRequestException(`Invalid shelf code present in request`)
      }

      throw error
    }
  }

  public removeBook = async (id: string): Promise<Book> => {
    const book = await this.bookRepository.findById(id, false)
    if (!book) throw new NotFoundException(`Book not found with id: ${id}`)

    const bookShelfJnEntries = await this.bookShelfJnRepository.getAllEntries(
      book.isbn
    )
    await this.bookShelfJnRepository.removeEntries(bookShelfJnEntries)

    return await this.bookRepository.removeBook(book)
  }

  public borrowBook = async (
    bookIsbn: string,
    borrowBookDto: BorrowBookDto
  ): Promise<BorrowedBook> => {
    const book = await this.bookRepository.findByISBN(bookIsbn, false)

    if (!book)
      throw new NotFoundException(
        `No books are available with isbn ${bookIsbn}`
      )

    if (book.availableCount === 0)
      throw new BadRequestException('Requested book not available')

    const { shelfCode, employeeId } = borrowBookDto

    const bookShelfEntry = await this.bookShelfJnRepository.getEntry(
      bookIsbn,
      shelfCode
    )

    if (!bookShelfEntry)
      throw new NotFoundException('Requested book no available')

    if (bookShelfEntry.bookCount === 0)
      throw new BadRequestException('Requested book not available on the shelf')

    const borrowedBook = await this.borrowedBookRepository.addBorrowedBook({
      bookIsbn: bookIsbn,
      employeeId: employeeId,
      shelfBorrowedFrom: shelfCode,
      borrowedAt: new Date().toISOString(),
    })

    await this.bookShelfJnRepository.updateEntry({
      ...bookShelfEntry,
      bookCount: bookShelfEntry.bookCount - 1,
    })

    await this.bookRepository.updateBook({
      ...book,
      availableCount: book.availableCount - 1,
    })

    await this.cronService.addCronJob({
      employeeId: borrowBookDto.employeeId,
      borrowedBookId: borrowedBook.id,
    })

    return borrowedBook
  }

  public returnBook = async (
    bookIsbn: string,
    borrowBookDto: BorrowBookDto
  ): Promise<BorrowedBook> => {
    const book = await this.bookRepository.findByISBN(bookIsbn, false)

    if (!book)
      throw new NotFoundException(`No books are found with isbn ${bookIsbn}`)

    const { shelfCode, employeeId } = borrowBookDto

    const bookShelfEntry = await this.bookShelfJnRepository.getEntry(
      bookIsbn,
      shelfCode
    )

    const borrowedBook = await this.borrowedBookRepository.findBy({
      employeeId: employeeId,
      bookIsbn: bookIsbn,
      returnedAt: IsNull(),
    })

    if (!borrowedBook)
      throw new BadRequestException("Employee hasn't borrowed this book")

    if (borrowedBook.returnedAt)
      throw new BadRequestException('Book was already returned')

    const updatedBorrowedBook =
      await this.borrowedBookRepository.updateBorrowedBook({
        ...borrowedBook,
        returnedAt: new Date().toISOString(),
        shelfReturnedTo: shelfCode,
      })

    if (bookShelfEntry)
      await this.bookShelfJnRepository.updateEntry({
        ...bookShelfEntry,
        bookCount: bookShelfEntry.bookCount + 1,
      })
    else
      await this.bookShelfJnRepository.addEntry({
        shelfCode: shelfCode,
        bookIsbn: bookIsbn,
        bookCount: 1,
      })

    await this.bookRepository.updateBook({
      ...book,
      availableCount: book.availableCount + 1,
    })

    const activeSubscriptions =
      await this.subscriptionRepository.getActiveSubscriptions(
        bookIsbn,
        employeeId
      )

    const newNotifications = activeSubscriptions.map((subscription) => ({
      employeeId: subscription.requestedBy,
      status: NotificationStatus.UNREAD,
      type: NotificationType.NOTIFY_ME,
      content: `${book.title} is now available on ${shelfCode}`,
    }))

    const updatedSubscriptions = activeSubscriptions.map((subscription) => ({
      ...subscription,
      status: SubscriptionStatus.INACTIVE,
    }))

    await this.subscriptionRepository.updateSubscriptions(updatedSubscriptions)

    await this.notificationService.addNotifications(newNotifications)

    const cronJob = await this.cronService.getCronJob(employeeId, borrowedBook.id)

    await this.cronService.removeCronJob(cronJob)

    return updatedBorrowedBook
  }

  public addSubscription = async (
    subscriptionDto: SubscriptionDto
  ): Promise<Subscription> => {
    const existingSubscriptions =
      await this.subscriptionRepository.getActiveSubscriptions(
        subscriptionDto.bookISBN,
        subscriptionDto.requestedBy
      )

    if (existingSubscriptions.length > 0) return existingSubscriptions[0]

    const newSubscription = await this.subscriptionRepository.addSubscription(
      subscriptionDto
    )

    if (subscriptionDto.requestedTo) {
      const { name } = await this.employeeRepository.findById(
        subscriptionDto.requestedBy
      )

      const { title } = await this.bookRepository.findByISBN(
        subscriptionDto.bookISBN,
        false
      )

      const newNotification = new Notification()
      newNotification.content = `${name} has requested for ${title}.`
      newNotification.employeeId = subscriptionDto.requestedTo
      newNotification.status = NotificationStatus.UNREAD
      newNotification.type = NotificationType.REQUEST

      await this.notificationService.addNotification(newNotification)
    }

    return newSubscription
  }
}

export default BookService
