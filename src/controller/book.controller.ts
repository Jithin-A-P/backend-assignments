import { NextFunction, Request, Response, Router } from "express";
import BookService from "../service/book.service";
import HttpException from "../exception/http.exception";
import BookDto from "../dto/book.dto";
import EditBookDto from "../dto/edit-book.dto";
import validator from "../middleware/validator.middleware";

class BookController {
  public router: Router;
  constructor(private bookService: BookService) {
    this.router = Router();
    this.router.get("/", this.getAllBooks);
    this.router.get("/:id", this.getBookById);
    this.router.get("/:isbn", this.getBookByISBN);
    this.router.post("/", validator(BookDto), this.addBook);
    this.router.put("/:id", validator(BookDto), this.updateBook);
    this.router.patch("/:id", validator(EditBookDto), this.editBook);
    this.router.delete("/:id", this.removeBook);
  }

  private getAllBooks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const books = await this.bookService.getAllBooks();
      res.status(200);
      res.locals.data = books;
      next();
    } catch (error) {
      next(error);
    }
  };

  private getBookById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookId = Number(req.params.id);
      if (!Number.isInteger(bookId))
        throw new HttpException(400, "Bad Request, invalid book URL");

      const book = await this.bookService.getBookById(bookId);
      res.status(200);
      res.locals.data = book;

      next();
    } catch (error) {
      next(error);
    }
  };

  private getBookByISBN = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookISBN = req.params.isbn;

      const book = await this.bookService.getBookByISBN(bookISBN);
      res.status(200);
      res.locals.data = book;

      next();
    } catch (error) {
      next(error);
    }
  };

  private addBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addedBook = await this.bookService.addBook(req.body);
      res.status(201);
      res.locals.data = addedBook;
      next();
    } catch (error) {
      next(error);
    }
  };

  private editBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookId = Number(req.params.id);
      if (!Number.isInteger(bookId))
        throw new HttpException(400, "Bad Request, invalid book URL");
      const editedBook = await this.bookService.editBook(bookId, req.body);
      res.status(200);
      res.locals.data = editedBook;
      next();
    } catch (error) {
      next(error);
    }
  };

  private updateBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookId = Number(req.params.id);
      if (!Number.isInteger(bookId))
        throw new HttpException(400, "Bad Request, invalid book URL");
      const updatedBook = await this.bookService.updateBook(bookId, req.body);
      res.status(200);
      res.locals.data = updatedBook;
      next();
    } catch (error) {
      next(error);
    }
  };

  private removeBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const bookId = Number(req.params.id);
      if (!Number.isInteger(bookId))
        throw new HttpException(400, "Bad Request, invalid book URL");
      const editedBook = await this.bookService.removeBook(bookId);
      res.status(204);
      res.locals.data = editedBook;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default BookController;
