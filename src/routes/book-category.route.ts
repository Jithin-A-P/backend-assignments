import BookCategoryController from '../controller/book-category.controller'

const bookCategoryController = new BookCategoryController()
const bookCategoryRoute = bookCategoryController.router

export default bookCategoryRoute
