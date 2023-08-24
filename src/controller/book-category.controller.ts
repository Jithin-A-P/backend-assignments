import { NextFunction, Request, Response, Router } from 'express'
import autheticate from '../middleware/authenticate.middleware'
import BookCategory from '../utils/book-category.enum'

class BookCategoryController {
  public router: Router

  constructor() {
    this.router = Router()
    this.router.get('/', autheticate, this.getBookCategories)
  }

  private getBookCategories = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.locals.data = Object.values(BookCategory)
      res.status(200)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default BookCategoryController
