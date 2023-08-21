import BookController from "../controller/book.controller";
import dataSource from "../db/postgres.db";
import Book from "../entity/book.entity";
import BookRepository from "../repository/book.repository";
import BookService from "../service/book.service";
import BookShelfJnRepository from "../repository/book-shelf-jn.repository";
import BookShelfJn from "../entity/book-shelf-jn.entity";

const bookRepository = new BookRepository(
    dataSource.getRepository(Book)
);
const bookShelfJnRepository = new BookShelfJnRepository(
    dataSource.getRepository(BookShelfJn)
)
const bookService = new BookService(bookRepository, bookShelfJnRepository);
const bookController = new BookController(bookService);
const bookRoute = bookController.router;

export default bookRoute;
