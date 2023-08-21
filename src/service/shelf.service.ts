import EditShelfDto from "../dto/edit-shelf.dto";
import ShelfDto from "../dto/shelf.dto";
import Book from "../entity/book.entity";
import Shelf from "../entity/shelf.entity";
import HttpException from "../exception/http.exception";
import NotFoundException from "../exception/not-found.exception";
import ShelfRepository from "../repository/shelf.repository";

class ShelfService {
  constructor(private shelfRepository: ShelfRepository) {}

  // public getAllShelves = (
  //     rowsPerPage: number,
  //     pageNumber: number
  // ): Promise<Shelf[]> => {
  //     const defaultRowsPerPage = 15
  //     const take = rowsPerPage || defaultRowsPerPage

  //     const rowsToSkip = (pageNumber - 1) * take
  //     const skip = rowsToSkip > 0 ? rowsToSkip : 0
  //     return this.shelfRepository.findAll(skip, take)
  // }

  public getAllShelves = (): Promise<Shelf[]> => {
    return this.shelfRepository.findAll();
  };

  public getShelfById = async (id: number): Promise<Shelf> => {
    const shelf = await this.shelfRepository.findById(id);
    if (!shelf) throw new NotFoundException(`Shelf not found with id: ${id}`);
    return shelf;
  };

  public addShelf = async (shelfDto: ShelfDto): Promise<Shelf> => {
    const book: Book[] = [];
    const shelf = { ...shelfDto, books: book };
    const newShelf = this.shelfRepository.add(shelf);
    return newShelf;
  };

  public removeShelf = async (id: number): Promise<Shelf> => {
    const shelf = await this.shelfRepository.findById(id);
    if (!shelf) throw new NotFoundException(`Shelf not found with id: ${id}`);

    if (shelf.books.length > 0)
      throw new HttpException(400, "Cannot delete shelf with books");
    return this.shelfRepository.remove(shelf);
  };

  public editShelf = async (
    id: number,
    editShelfDto: EditShelfDto
  ): Promise<Shelf> => {
    const shelf = await this.shelfRepository.findById(id);
    if (!shelf) throw new NotFoundException(`Shelf not found with id: ${id}`);

    for (const key in editShelfDto)
      if (!(key in shelf)) throw new HttpException(400, `Bad Request`);

    const editedShelf = await this.shelfRepository.update({
      ...shelf,
      ...editShelfDto,
    });
    return editedShelf;
  };

  public updateShelf = async (id: number, shelfDto: Shelf): Promise<Shelf> => {
    const shelf = await this.shelfRepository.findById(id);
    if (!shelf) throw new NotFoundException(`Shelf not found with id: ${id}`);

    return this.shelfRepository.update({
      ...shelf,
      ...shelfDto,
    });
  };
}

export default ShelfService;
