import { DataSource } from "typeorm";
import Book from "../../entity/book.entity";
import BookRepository from "../../repository/book.repository";
import BookService from "../../service/book.service";
import BookShelfJnRepository from "../../repository/book-shelf-jn.repository";
import BorrowedBookRepository from "../../repository/borrowed-book.repository";
import EmployeeRepository from "../../repository/employee.repository";
import SubscriptionRepository from "../../repository/subscription.repository";
import CronService from "../../service/cron.service";
import NotificationService from "../../service/notification.service";
import ShelfService from "../../service/shelf.service";
import { when } from "jest-when";
import BookCategory from "../../utils/book-category.enum";
import NotFoundException from "../../exception/not-found.exception";
import BookShelfJn from "../../entity/book-shelf-jn.entity";

describe("Book service tests", () => {
  let bookRepository: BookRepository;
  let bookService: BookService;
  let bookShelfJnRepository: BookShelfJnRepository;
  let borrowedBookRepository: BorrowedBookRepository;
  let subscriptionRepository: SubscriptionRepository;
  let employeeRepository: EmployeeRepository;
  let shelfService: ShelfService;
  let notificationService: NotificationService;
  let cronService: CronService;
  let books: Book[];
  beforeAll(() => {
    const dataSource: DataSource = {
      getRepository: jest.fn(),
    } as unknown as DataSource;
    bookRepository = new BookRepository(dataSource.getRepository(Book));
    bookService = new BookService(
      bookRepository,
      bookShelfJnRepository,
      borrowedBookRepository,
      subscriptionRepository,
      employeeRepository,
      shelfService,
      notificationService,
      cronService
    );
    books = [
      {
        isbn: "1",
        title: "Book A",
        author: "Author of A",
        category: BookCategory.FICTION,
        totalCount: 2,
        availableCount: 1,
        bookShelfJns: [
          {
            shelfCode: "Shelf A",
            bookIsbn: "1",
            bookCount: 1
          }
        ],
        borrowedBooks: [
          {
            employeeId: "100",
            bookIsbn: "1",
            borrowedAt:"1/2/23",
            shelfBorrowedFrom:"Shelf B"
          }
        ]
      },
      {
        isbn: "2",
        title: "Book B",
        author: "Author of B",
        category: BookCategory.FICTION,
        totalCount: 2,
        availableCount: 1,
        bookShelfJns: [
          {
            shelfCode: "Shelf B",
            bookIsbn: "2",
            bookCount: 1
          }
        ],
        borrowedBooks: [
          {
            employeeId: "101",
            bookIsbn: "2",
            borrowedAt:"3/3/23",
            shelfBorrowedFrom:"Shelf B"
          }
        ]
      }
    ];
  });
  describe("Test for getBookById", () => {
    test("Success case", async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith("1",true).mockResolvedValueOnce(books[0])
      bookRepository.findById = mockFindById;
      const book = await bookService.getBookById("1");
      expect(book).toMatchObject(books[0])
    })
    test("Failure case", () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith("3",true).mockResolvedValueOnce(null)
      bookRepository.findById = mockFindById;
      const book = async() => await bookService.getBookById("3");
      expect(book).rejects.toThrowError(NotFoundException)
    })
  })

  // describe("Test for removeBook", () => {
  //   test("Success case", async () => {
  //     const mockFindById = jest.fn()
  //     // const mockGetAllEntries = jest.fn()
  //     // const mockremoveEntry = jest.fn()
  //     when(mockFindById).calledWith("1",false).mockResolvedValueOnce(books[0])
  //     // when(mockGetAllEntries).calledWith("1").mockResolvedValueOnce(books[0].bookShelfJns)
  //     // when(mockremoveEntry).calledWith(books[0].bookShelfJns).mockResolvedValueOnce(books[0].bookShelfJns)
  //     jest.spyOn(bookShelfJnRepository, 'getAllEntries').mockResolvedValue(books[0].bookShelfJns as BookShelfJn[]);
  //     jest.spyOn(bookShelfJnRepository, 'removeEntries').mockResolvedValue(books[0].bookShelfJns as BookShelfJn[]);
  //     bookRepository.findById = mockFindById;
  //     // bookShelfJnRepository.getAllEntries = mockGetAllEntries;
  //     // bookShelfJnRepository.removeEntries = mockremoveEntry;
  //     // const entires = await bookShelfJnRepository.getAllEntries("1")
  //     // const deletedEntires = await bookShelfJnRepository.removeEntries(entires)
  //     const book = await bookService.removeBook("1");
  //     expect(book).toMatchObject(books[0])
  //   })
  //   // test("Failure case", () => {
  //   //   const mockFindById = jest.fn()
  //   //   when(mockFindById).calledWith("3",true).mockResolvedValueOnce(null)
  //   //   bookRepository.findById = mockFindById;
  //   //   const book = async() => await bookService.getBookById("3");
  //   //   expect(book).rejects.toThrowError(NotFoundException)
  //   // })
  // })
});
