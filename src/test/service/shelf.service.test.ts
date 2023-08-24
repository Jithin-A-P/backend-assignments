import { DataSource } from 'typeorm';
import ShelfRepository from '../../repository/shelf.repository';
import ShelfService from '../../service/shelf.service'
import Shelf from '../../entity/shelf.entity';
import { when } from 'jest-when';
import { plainToInstance } from 'class-transformer';
import ShelfDto from '../../dto/shelf.dto';
import EditShelfDto from '../../dto/edit-shelf.dto';


describe('Shelf Service Tests', () => {
    let shelfService: ShelfService;
    let shelfRepository: ShelfRepository;

    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource
        
        shelfRepository = new ShelfRepository(
            dataSource.getRepository(Shelf)
        )
        shelfService = new ShelfService(shelfRepository)
    })

    describe('Test for getAllShelves', () => {
        test('Success case', async () => {
            const mockFindAll = jest.fn();
            mockFindAll.mockResolvedValueOnce([{ shelfCode: 'Shelf Code', location: 'Location 1' }])
            shelfRepository.findAll = mockFindAll;

            const shelves = await shelfService.getAllShelves();
            expect(shelves).toStrictEqual([{ shelfCode: 'Shelf Code', location: 'Location 1' }])
        })

        test('Empty case', async () => {
            const mockFindAll = jest.fn();
            mockFindAll.mockResolvedValueOnce([])
            shelfRepository.findAll = mockFindAll;

            const shelves = await shelfService.getAllShelves();
            expect(shelves).toStrictEqual([])
        })
    })

    describe('Test for getShelfById', () => {
        test('Success case', async () => {
            const mockFindById = jest.fn();
            when(mockFindById).calledWith("1").mockResolvedValueOnce({ shelfCode: 'Shelf Code', location: 'Location 1' , bookShelfJns: [{book: "a"}]})
            // const { bookShelfJns } = shelf
            shelfRepository.findById = mockFindById;

            const shelves = await shelfService.getShelfById("1");
            expect(shelves).toStrictEqual({ shelfCode: 'Shelf Code', location: 'Location 1' , books: ["a"]})
        })

        test('Failure case', async () => {
            const mockFindById = jest.fn();
            when(mockFindById).calledWith("2").mockResolvedValueOnce(null)
            shelfRepository.findById = mockFindById;
            expect(
                async () => await shelfService.getShelfById("2")
            ).rejects.toThrow();
        })
    })

    describe('Test for addShelf', () => {
        test('Success case', async () => {
            const mockAdd = jest.fn();
            mockAdd.mockResolvedValueOnce([{ shelfCode: 'Shelf Code', location: 'Location 1' }])
            shelfRepository.add = mockAdd;
            const shelfDto = plainToInstance(ShelfDto, {
                shelfCode: 'Shelf Code',
                location: 'Location 1'
            })

            const shelf = await shelfService.addShelf(shelfDto);
            expect(shelf).toStrictEqual([{ shelfCode: 'Shelf Code', location: 'Location 1' }])
        })
    })

    describe('Test for removeShelf', () => {
        test('Success case', async () => {
            const mockFindById = jest.fn();
            when(mockFindById).calledWith("1").mockResolvedValueOnce({ shelfCode: 'Shelf Code', location: 'Location 1', bookShelfJns: []})
            shelfRepository.findById = mockFindById;
            
            const mockRemove = jest.fn();
            mockRemove.mockImplementation((shelf) => {})
            shelfRepository.remove = mockRemove;
            expect(shelfService.removeShelf("1")).resolves.not.toThrowError()
        })

        test('Failure case', async () => {
            const mockFindById = jest.fn();
            when(mockFindById).calledWith("1").mockResolvedValueOnce(null)
            shelfRepository.findById = mockFindById;
            
            const mockRemove = jest.fn();
            mockRemove.mockImplementation((shelf) => {})
            shelfRepository.remove = mockRemove;
            expect(shelfService.removeShelf("1")).rejects.toThrowError()
        })

        test('Failure case where book in shelf', async () => {
            const mockFindById = jest.fn();
            when(mockFindById).calledWith("1").mockResolvedValueOnce({ shelfCode: 'Shelf Code', location: 'Location 1', bookShelfJns: ["Book 1"] })
            shelfRepository.findById = mockFindById;
            
            const mockRemove = jest.fn();
            mockRemove.mockImplementation((shelf) => {})
            shelfRepository.remove = mockRemove;
            expect(shelfService.removeShelf("1")).rejects.toThrowError()
        })

    })

    describe('Test for updateShelf', () => {
        test('Success case', async () => {
            const mockFindById = jest.fn();
            when(mockFindById).calledWith("1").mockResolvedValueOnce(new Shelf())
            shelfRepository.findById = mockFindById;

            const mockUpdate = jest.fn();
            mockUpdate.mockImplementation((shelf) => {})
            shelfRepository.update = mockUpdate;
            const shelfDto = plainToInstance(ShelfDto, {
                shelfCode: 'Shelf Code',
                location: 'Location 1',
                book: []
            })

            expect(
                async () =>
                  await shelfService.updateShelf(
                    '1',
                    shelfDto as Shelf
                  )
              ).not.toThrowError()
        })

        test('Failure case', async () => {
            const mockFindById = jest.fn();
            when(mockFindById).calledWith("1").mockResolvedValueOnce(null)
            shelfRepository.findById = mockFindById;

            const mockUpdate = jest.fn();
            mockUpdate.mockImplementation((shelf) => {})
            shelfRepository.update = mockUpdate;
            const shelfDto = plainToInstance(ShelfDto, {
                shelfCode: 'Shelf Code',
                location: 'Location 1',
                book: []
            })

            expect(
                async () =>
                  await shelfService.updateShelf(
                    "1",
                    shelfDto as Shelf
                  )
              ).rejects.toThrowError()
        })
    })

    describe('Test for editShelf', () => {
        test('Success case', async () => {
            const mockFindById = jest.fn();
            when(mockFindById).calledWith("1").mockResolvedValueOnce({shelfCode: 'Shelf Code',
            location: 'Location 1'})
            shelfRepository.findById = mockFindById;

            const mockUpdate = jest.fn();
            mockUpdate.mockImplementation((shelf) => {})
            shelfRepository.update = mockUpdate;
            const shelfDto = plainToInstance(EditShelfDto, {
                shelfCode: 'Shelf Code',
                location: 'Location 1',
            })

            expect(
                async () =>
                  await shelfService.editShelf(
                    "1",
                    shelfDto as Shelf
                  )
              ).not.toThrowError()
        })

        test('Failure case', async () => {
            const mockFindById = jest.fn();
            when(mockFindById).calledWith("1").mockResolvedValueOnce(null)
            shelfRepository.findById = mockFindById;

            const mockUpdate = jest.fn();
            mockUpdate.mockImplementation((shelf) => {})
            shelfRepository.update = mockUpdate;
            const shelfDto = plainToInstance(EditShelfDto, {
                shelfCode: 'Shelf Code',
                location: 'Location 1',
            })

            expect(
                async () =>
                  await shelfService.editShelf(
                    "1",
                    shelfDto as Shelf
                  )
              ).rejects.toThrowError()
        })

        test('Failure case where invalid field is passed', async () => {
            const mockFindById = jest.fn();
            when(mockFindById).calledWith("1").mockResolvedValueOnce(new Shelf())
            shelfRepository.findById = mockFindById;

            const mockUpdate = jest.fn();
            mockUpdate.mockImplementation((shelf) => {})
            shelfRepository.update = mockUpdate;
            const shelfDto = plainToInstance(EditShelfDto, {
                shelfCode: 'Shelf Code',
                location: 'Location 1',
                room: 'Room 1'
            })

            expect(
                async () =>
                  await shelfService.editShelf(
                    "1",
                    shelfDto as Shelf
                  )
              ).rejects.toThrowError()
        })
    })

    
})