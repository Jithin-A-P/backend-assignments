import { DataSource } from 'typeorm'
import DepartmentRepository from '../../repository/department.repository'
import DepartmentService from '../../service/department.service'
import Department from '../../entity/department.entity'
import HttpException from '../../exception/http.exception'
import { when } from 'jest-when'
import { plainToInstance } from 'class-transformer'
import DepartmentDto from '../../dto/department.dto'
import EditDepartmentDto from '../../dto/edit-department.dto'

describe('Department Service Tests', () => {
  let departmentService: DepartmentService
  let departmentRepository: DepartmentRepository

  beforeAll(() => {
    const dataSource: DataSource = {
      getRepository: jest.fn(),
    } as unknown as DataSource

    departmentRepository = new DepartmentRepository(
      dataSource.getRepository(Department)
    )
    departmentService = new DepartmentService(departmentRepository)
  })

  describe('Test for getAllDepartments', () => {
    test('Success case', async () => {
      const mockFindAll = jest.fn()
      mockFindAll.mockResolvedValueOnce([{ id: '1', name: 'UI' }])
      departmentRepository.findAll = mockFindAll

      const departments = await departmentService.getAllDepartments()
      expect(departments).toStrictEqual([{ id: '1', name: 'UI' }])
    })

    test('Empty case', async () => {
      const mockFindAll = jest.fn()
      mockFindAll.mockResolvedValueOnce([])
      departmentRepository.findAll = mockFindAll

      const departments = await departmentService.getAllDepartments()
      expect(departments).toStrictEqual([])
    })
  })

  describe('Test for getDepartmentById', () => {
    test('Success case', async () => {
      const mockFindById = jest.fn()
      const mockDpt = { id: 1, name: 'dept' }
      when(mockFindById).calledWith(1).mockResolvedValueOnce(mockDpt)
      departmentRepository.findById = mockFindById

      const department = await departmentService.getDepartmentById(1)
      expect(department).toStrictEqual(mockDpt)
    })

    test('Failure case', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith(2).mockResolvedValueOnce(null)
      departmentRepository.findById = mockFindById

      expect(
        async () => await departmentService.getDepartmentById(2)
      ).rejects.toThrowError()
    })
  })

  describe('Test for addDepartment', () => {
    test('Success case', async () => {
      const mockAdd = jest.fn()
      mockAdd.mockResolvedValueOnce({ id: 1 })
      departmentRepository.add = mockAdd
      const departmentDto = plainToInstance(DepartmentDto, {
        id: 1,
        name: 'dept',
      })
      const department = await departmentService.addDepartment(
        departmentDto as Department
      )

      expect(department).toStrictEqual({ id: 1 })
    })
  })

  describe('Tests for updateDepartment', () => {
    test('Success case', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith(1).mockResolvedValue(new Department())
      departmentRepository.findById = mockFindById

      const mockUpdate = jest.fn()
      mockUpdate.mockImplementation((dept) => {})
      departmentRepository.update = mockUpdate

      const updateDepartmentDto = plainToInstance(DepartmentDto, {
        id: 1,
        name: 'DEPT',
      })

      expect(
        async () =>
          await departmentService.updateDepartment(
            updateDepartmentDto as Department
          )
      ).not.toThrowError()
    })

    test('Failure case', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith(1).mockResolvedValue(null)
      departmentRepository.findById = mockFindById

      const mockUpdate = jest.fn()
      mockUpdate.mockImplementation((dept) => {})
      departmentRepository.update = mockUpdate

      const updateDepartmentDto = plainToInstance(DepartmentDto, {
        id: 1,
        name: 'DEPT',
      })

      expect(
        async () =>
          await departmentService.updateDepartment(
            updateDepartmentDto as Department
          )
      ).rejects.toThrowError()
    })
  })

  describe('Tests for editDepartment', () => {
    test('Success case', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith(1).mockResolvedValue({
        id: 1,
        name: 'Name'
      })
      departmentRepository.findById = mockFindById

      const mockUpdate = jest.fn()
      mockUpdate.mockImplementation((dept) => {})
      departmentRepository.update = mockUpdate

      const editDepartmentDto = plainToInstance(EditDepartmentDto, {
        name: 'Dept',
      })

      expect(
        async () =>
          await departmentService.editDepartment(
            1,
            editDepartmentDto
          )
      ).not.toThrowError()
    })

    test('Failure case', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith(1).mockResolvedValue({
        id: 1,
        name: 'Name'
      })
      departmentRepository.findById = mockFindById

      const mockUpdate = jest.fn()
      mockUpdate.mockImplementation((dept) => {})
      departmentRepository.update = mockUpdate

      const editDepartmentDto = plainToInstance(EditDepartmentDto, {
        name1: 'Dept',
      })

      expect(
        async () =>
          await departmentService.editDepartment(
            1,
            editDepartmentDto
          )
      ).rejects.toThrowError()
    })

    test('Failure case null returned', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith(1).mockResolvedValue(null)
      departmentRepository.findById = mockFindById

      const mockUpdate = jest.fn()
      mockUpdate.mockImplementation((dept) => {})
      departmentRepository.update = mockUpdate

      const editDepartmentDto = plainToInstance(EditDepartmentDto, {
        name: 'Dept',
      })

      expect(
        async () =>
          await departmentService.editDepartment(
            1,
            editDepartmentDto
          )
      ).rejects.toThrowError()
    })
  })

  describe('Tests for removeDepartment', () => {
    test('Success case', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith(1).mockResolvedValue({
        id: 1,
        name: 'UI',
      })
      departmentRepository.findById = mockFindById

      const mockRemove = jest.fn()
      mockRemove.mockImplementation((dept) => {})
      departmentRepository.remove = mockRemove

      expect(
        departmentService.removeDepartmentById(1)
      ).resolves.not.toThrowError()
    })

    test('Failure case', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith(1).mockResolvedValue(null)
      departmentRepository.findById = mockFindById

      const mockRemove = jest.fn()
      mockRemove.mockImplementation((dept) => {})
      departmentRepository.remove = mockRemove

      expect(
        departmentService.removeDepartmentById(1)
      ).rejects.toThrowError()
    })
  })
})
