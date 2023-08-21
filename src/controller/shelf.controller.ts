import { NextFunction, Request, Response, Router } from "express";
import ShelfService from "../service/shelf.service";
import HttpException from "../exception/http.exception";
import ShelfDto from "../dto/shelf.dto";
import validator from '../middleware/validator.middleware'
import EditShelfDto from "../dto/edit-shelf.dto";

class ShelfController {
    public router: Router;
    constructor(private shelfService: ShelfService) {
        this.router = Router();
        this.router.get('/', this.getAllShelves);
        this.router.get('/:id', this.getShelfById);
        this.router.post('/', validator(ShelfDto), this.addShelf);
        this.router.put('/:id', validator(ShelfDto), this.updateShelfById);
        this.router.patch('/:id', validator(EditShelfDto), this.editShelfById);
        this.router.delete('/:id', this.removeShelfById);
    }

    private getAllShelves = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try{
            const shelves = await this.shelfService.getAllShelves();
            res.status(200);
            res.locals.data = shelves;
            next();
        } catch (error) {
            next(error);
        }
    }

    private getShelfById = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try{
            const shelfId = Number(req.params.id);
            if (!Number.isInteger(shelfId))
                throw new HttpException(400, 'Bad Request, invalid shelf URL')
            
            const shelf = await this.shelfService.getShelfById(shelfId);
            res.status(200);
            res.locals.data = shelf;
            
            next();
        } catch (error) {
            next(error);
        }
    }

    private addShelf = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try{
            const addedShelf = await this.shelfService.addShelf(req.body);
            res.status(201);
            res.locals.data = addedShelf;
            next();
        } catch (error) {
            next(error);
        }
    }

    private editShelfById = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try{
            const shelfId = Number(req.params.id);
            if (!Number.isInteger(shelfId))
                throw new HttpException(400, 'Bad Request, invalid shelf URL')
            const editedShelf = await this.shelfService.editShelf(shelfId, req.body);
            res.status(200);
            res.locals.data = editedShelf;
            next();
        } catch (error) {
            next(error);
        }
    }

    private updateShelfById = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try{
           
            const shelfId = Number(req.params.id);
            if (!Number.isInteger(shelfId))
                throw new HttpException(400, 'Bad Request, invalid shelf URL')
            const updatedShelf = await this.shelfService.updateShelf(shelfId, req.body);
            res.status(200);
            res.locals.data = updatedShelf;
            next();
        } catch (error) {
            next(error);
        }
    }

    private removeShelfById = async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try{
            const shelfId = Number(req.params.id);
            if (!Number.isInteger(shelfId))
                throw new HttpException(400, 'Bad Request, invalid shelf URL')
            const editedShelf = await this.shelfService.removeShelf(shelfId);
            res.status(204);
            res.locals.data = editedShelf;
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default ShelfController;
