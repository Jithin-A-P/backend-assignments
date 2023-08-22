import { NextFunction, Request, Response, Router } from 'express'
import BookService from '../service/book.service'
import BookDto from '../dto/book.dto'
import validator from '../middleware/validator.middleware'
import BorrowBookDto from '../dto/borrow-book.dto'
import autheticate from '../middleware/authenticate.middleware'
import authorize from '../middleware/authorize.middleware'
import Role from '../utils/role.enum'
import BadRequestException from '../exception/bad-request.exception'

class BookController {
  public router: Router
  constructor(private bookService: BookService) {
    this.router = Router()
    this.router.get('/', autheticate, this.getAllBooks)
    this.router.get('/:id', autheticate, this.getBookById)
    this.router.post(
      '/',
      // autheticate,
      // authorize([Role.ADMIN]),
      validator(BookDto),
      this.addBook
    )
    this.router.post(
      '/:isbn/lend',
      autheticate,
      validator(BorrowBookDto),
      this.borrowBook
    )
    this.router.post(
      '/:isbn/return',
      autheticate,
      validator(BorrowBookDto),
      this.returnBook
    )
    this.router.put(
      '/:id',
      autheticate,
      authorize([Role.ADMIN]),
      validator(BookDto),
      this.updateBook
    )
    this.router.delete(
      '/:id',
      autheticate,
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

      const books = await this.bookService.getAllBooks(
        rowsPerPage,
        pageNumber
      )
      
      res.status(200)
      res.locals.data = books
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
      const bookId = Number(req.params.id)
      if (!Number.isInteger(bookId))
        throw new BadRequestException('Bad Request, invalid book URL')

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
      const bookId = Number(req.params.id)
      if (!Number.isInteger(bookId))
        throw new BadRequestException('Bad Request, invalid book URL')

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
      const bookId = Number(req.params.id)
      if (!Number.isInteger(bookId))
        throw new BadRequestException('Bad Request, invalid book URL')

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