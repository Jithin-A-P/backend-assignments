import EditShelfDto from '../dto/edit-shelf.dto'
import ShelfDto from '../dto/shelf.dto'
import Book from '../entity/book.entity'
import Shelf from '../entity/shelf.entity'
import BadRequestException from '../exception/bad-request.exception'
import NotFoundException from '../exception/not-found.exception'
import ShelfRepository from '../repository/shelf.repository'

class ShelfService {
  constructor(private shelfRepository: ShelfRepository) {}

  public getAllShelves = (): Promise<Shelf[]> => {
    return this.shelfRepository.findAll()
  }

  public getShelfById = async (id: string): Promise<Shelf> => {
    const shelf = await this.shelfRepository.findById(id)
    if (!shelf) throw new NotFoundException(`Shelf not found with id: ${id}`)

    const { bookShelfJns } = shelf
    delete shelf['bookShelfJns']

    shelf.books = bookShelfJns.map((bookShelfJn) => bookShelfJn.book)

    return shelf
  }

  public addShelf = async (shelfDto: ShelfDto): Promise<Shelf> => {
    const book: Book[] = []
    const shelf = { ...shelfDto, books: book }
    const newShelf = this.shelfRepository.add(shelf)
    return newShelf
  }

  public removeShelf = async (id: string): Promise<Shelf> => {
    const shelf = await this.shelfRepository.findById(id)
    if (!shelf) throw new NotFoundException(`Shelf not found with id: ${id}`)

    if (shelf.bookShelfJns.length > 0)
      throw new BadRequestException('Cannot delete shelf with books')

    return this.shelfRepository.remove(shelf)
  }

  public editShelf = async (
    id: string,
    editShelfDto: EditShelfDto
  ): Promise<Shelf> => {
    const shelf = await this.shelfRepository.findById(id)
    if (!shelf) throw new NotFoundException(`Shelf not found with id: ${id}`)

    for (const key in editShelfDto)
      if (!(key in shelf)) throw new BadRequestException(`Bad Request`)

    const editedShelf = await this.shelfRepository.update({
      ...shelf,
      ...editShelfDto,
    })
    return editedShelf
  }

  public updateShelf = async (id: string, shelfDto: Shelf): Promise<Shelf> => {
    const shelf = await this.shelfRepository.findById(id)
    if (!shelf) throw new NotFoundException(`Shelf not found with id: ${id}`)

    return this.shelfRepository.update({
      ...shelf,
      ...shelfDto,
    })
  }
}

export default ShelfService
