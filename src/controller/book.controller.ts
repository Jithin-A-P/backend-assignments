import { NextFunction, Request, Response, Router } from 'express'
import { isUUID } from 'class-validator'
import { UploadedFile } from 'express-fileupload'
import BookService from '../service/book.service'
import BookDto from '../dto/book.dto'
import validateBody from '../middleware/validate-body.middleware'
import BorrowBookDto from '../dto/borrow-book.dto'
import authenticate from '../middleware/authenticate.middleware'
import authorize from '../middleware/authorize.middleware'
import Role from '../utils/role.enum'
import SubscriptionDto from '../dto/subscription.dto'
import BadRequestException from '../exception/bad-request.exception'

class BookController {
  public router: Router
  constructor(private bookService: BookService) {
    this.router = Router()
    this.router.get('/', authenticate, this.getAllBooks)
    this.router.get('/:id', authenticate, this.getBookById)
    this.router.post(
      '/',
      authenticate,
      authorize([Role.ADMIN]),
      validateBody(BookDto),
      this.addBook
    )
    this.router.post(
      '/upload',
      authenticate,
      authorize([Role.ADMIN]),
      validateBody(BookDto),
      this.blukAddBooks
    )
    this.router.post(
      '/:isbn/lend',
      authenticate,
      validateBody(BorrowBookDto),
      this.borrowBook
    )
    this.router.post(
      '/:isbn/return',
      authenticate,
      validateBody(BorrowBookDto),
      this.returnBook
    ),
      this.router.post(
        '/:id/subscribe',
        authenticate,
        validateBody(SubscriptionDto),
        this.addSubscription
      ),
      this.router.put(
        '/:id',
        authenticate,
        authorize([Role.ADMIN]),
        validateBody(BookDto),
        this.updateBook
      )
    this.router.delete(
      '/:id',
      authenticate,
      authorize([Role.ADMIN]),
      this.removeBook
    )
  }

  private getAllBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const rowsPerPage = Number(req.query.rowsPerPage)
      const pageNumber = Number(req.query.pageNumber)

      const searchQuery = req.query.searchQuery as string
      const category = req.query.category as string
      const available = req.query.available as string

      const books = await this.bookService.getAllBooks(
        rowsPerPage,
        pageNumber,
        searchQuery,
        category,
        available
      )

      res.locals.total = books.pop()
      res.locals.data = books.pop()
      res.status(200)
      next()
    } catch (error) {
      next(error)
    }
  }

  private getBookById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookId = req.params.id
      if (!isUUID(bookId)) throw new BadRequestException('Invalid book id')

      const book = await this.bookService.getBookById(bookId)
      res.status(200)
      res.locals.data = book

      next()
    } catch (error) {
      next(error)
    }
  }

  private addBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addedBook = await this.bookService.addBook(req.body)
      res.status(201)
      res.locals.data = addedBook
      next()
    } catch (error) {
      next(error)
    }
  }

  private blukAddBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const file = req.files.data as UploadedFile

      res.status(201)
      res.locals.data = await this.bookService.bulkAddBook(file)
      next()
    } catch (error) {
      next(error)
    }
  }

  private addSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const newSubscription = await this.bookService.addSubscription(req.body)
      res.status(201)
      res.locals.data = newSubscription
      next()
    } catch (error) {
      next(error)
    }
  }

  private borrowBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookIsbn = req.params.isbn

      const borrowedBook = await this.bookService.borrowBook(bookIsbn, req.body)

      res.status(200)
      res.locals.data = borrowedBook
      next()
    } catch (error) {
      next(error)
    }
  }

  private returnBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookIsbn = req.params.isbn

      const returnedBook = await this.bookService.returnBook(bookIsbn, req.body)

      res.status(200)
      res.locals.data = returnedBook
      next()
    } catch (error) {
      next(error)
    }
  }

  private updateBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookId = req.params.id
      if (!isUUID(bookId)) throw new BadRequestException('Invalid book id')

      const updatedBook = await this.bookService.updateBook(bookId, req.body)
      res.status(200)
      res.locals.data = updatedBook
      next()
    } catch (error) {
      next(error)
    }
  }

  private removeBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookId = req.params.id
      if (!isUUID(bookId)) throw new BadRequestException('Invalid book id')

      const editedBook = await this.bookService.removeBook(bookId)
      res.status(204)
      res.locals.data = editedBook
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default BookController
