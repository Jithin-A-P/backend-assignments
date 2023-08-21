import ShelfController from "../controller/shelf.controller";
import dataSource from "../db/postgres.db";
import Shelf from "../entity/shelf.entity";
import ShelfRepository from "../repository/shelf.repository";
import ShelfService from "../service/shelf.service";

const shelfRepository = new ShelfRepository(
    dataSource.getRepository(Shelf)
);
const shelfService = new ShelfService(shelfRepository);
const shelfController = new ShelfController(shelfService);
const shelfRoute = shelfController.router;

export default shelfRoute;
