import { Repository } from 'typeorm'
import Shelf from '../entity/shelf.entity'

class ShelfRepository {
  constructor(private shelfRepository: Repository<Shelf>) {}

  public findAll = (): Promise<Shelf[]> => {
    return this.shelfRepository.find()
  }

  public findById = (id: number): Promise<Shelf> => {
    return this.shelfRepository.findOne({
      where: { id: id },
      relations: {
        bookShelfJns: {
          book: true,
        },
      },
    })
  }

  public findByShelfCode = (shelfCode: string): Promise<Shelf> => {
    return this.shelfRepository.findOne({
      where: { shelfCode: shelfCode },
      relations: {
        bookShelfJns: {
          book: true,
        },
      },
    })
  }

  public add = (shelf: Shelf): Promise<Shelf> => {
    return this.shelfRepository.save(shelf)
  }

  public remove = (shelf: Shelf): Promise<Shelf> => {
    return this.shelfRepository.softRemove(shelf)
  }

  public update = (shelf: Shelf): Promise<Shelf> => {
    return this.shelfRepository.save(shelf)
  }
}

export default ShelfRepository
