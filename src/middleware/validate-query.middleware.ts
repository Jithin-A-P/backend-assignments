import { NextFunction, Response } from "express";
import RequestWithUser from "../utils/request-with-user.interface";
import { isEnum, isNumber, isString, isUUID } from "class-validator";
import BadRequestException from "../exception/bad-request.exception";
import BookCategory from "../utils/book-category.enum";

const validateQuery = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const rowsPerPage = Number(req.query.rowsPerPage);
    const pageNumber = Number(req.query.pageNumber);
    const searchQuery = req.query.searchQuery as string;
    const category = req.query.category as string;
    const available = req.query.available as string;
    const id = req.query.employeeId;

    if (req.query.rowsPerPage) {
      if (isNaN(rowsPerPage))
        throw new BadRequestException("Invalid query parameter: rowsPerPage");
    }

    if (req.query.pageNumber) {
      if (isNaN(pageNumber))
        throw new BadRequestException("Invalid query parameter: pageNumber");
    }

    if (req.query.searchQuery) {
      if (!isString(searchQuery))
        throw new BadRequestException("Invalid query parameter: searchQuery");
    }

    if (req.query.category) {
      if (!isEnum(BookCategory, category))
        throw new BadRequestException("Invalid query parameter: category");
    }

    if (req.query.available) {
      if (available !== "true" && available !== "false")
        throw new BadRequestException("Invalid query parameter: available");
    }

    if (req.query.employeeId) {
      if (isUUID(id))
        throw new BadRequestException("Invalid query parameter: employeeId");
    }

    next();
  } catch (error) {
    console.log("Inside catch");
    next(error);
  }
};

export default validateQuery;
