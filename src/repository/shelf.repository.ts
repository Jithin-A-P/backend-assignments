import { Repository } from "typeorm";
import Shelf from "../entity/shelf.entity";
import BookShelfJn from "../entity/book-shelf-jn.entity";

class ShelfRepository {
    constructor(private shelfRepository: Repository<Shelf>) {}

    // public findAll = (skip: number, take: number): Promise<Shelf[]> => {
    //     return this.shelfRepository.find({
    //         skip: skip,
    //         take: take,
    //     })
    // }

    public findAll = (): Promise<Shelf[]> => {
        return this.shelfRepository.find()
    }

    public findById = (id: number): Promise<Shelf> => {
        return this.shelfRepository.findOne({
            where: {id: id},
            relations: {
                books: true,
            }
        })
    }

    public add = (shelf: Shelf): Promise<Shelf> => {
        return this.shelfRepository.save(shelf);
    }

    public remove = (shelf: Shelf): Promise<Shelf> => {
        return this.shelfRepository.softRemove(shelf);
    }

    public update = (shelf: Shelf): Promise<Shelf> => {
        return this.shelfRepository.save(shelf);
    }
}

export default ShelfRepository;
