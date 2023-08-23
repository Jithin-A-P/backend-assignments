import * as dotenv from 'dotenv'
dotenv.config({ path: __dirname + '/../../../.env' })

import { DataSource } from 'typeorm'
import { when } from 'jest-when'
import EmployeeRepository from '../../repository/employee.repository'
import Employee from '../../entity/employee.entity'
import EmployeeService from '../../service/employee.service'
import Role from '../../utils/role.enum'
import Address from '../../entity/address.entity'
import { plainToInstance } from 'class-transformer'
import EmployeeDto from '../../dto/employee.dto'
import HttpException from '../../exception/http.exception'
import LoginDto from '../../dto/login.dto'
import EditEmployeeDto from '../../dto/edit-employee.dto'
import NotFoundException from '../../exception/not-found.exception'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import BorrowedBook from '../../entity/borrowed-book.entity'

describe('Employee Service Tests', () => {
  let employeeRepository: EmployeeRepository
  let employeeService: EmployeeService
  beforeAll(() => {
    const dataSource: DataSource = {
      getRepository: jest.fn(),
    } as unknown as DataSource
    employeeRepository = new EmployeeRepository(
      dataSource.getRepository(Employee)
    )
    employeeService = new EmployeeService(employeeRepository)
  })

  describe('Test for getEmployeeById', () => {
    test('Success Case', async () => {
      const mockEmployee: Employee = {
        id: 'a',
        createdAt: new Date('2023-08-04T03:13:09.449Z'),
        updatedAt: new Date('2023-08-04T03:13:09.449Z'),
        deletedAt: null,
        name: 'John Newman',
        email: 'john@mail.com',
        age: null,
        password:
          '$2b$10$V3PqZiOnyewT/Y6ai8Q9QeHv1A7TVe1pUQE0PQocDNKpSlBnrvAN.',
        role: Role.UI,
        address: {
          id: 'a',
          createdAt: new Date('2023-08-04T03:13:09.449Z'),
          updatedAt: new Date('2023-08-04T03:13:09.449Z'),
          deletedAt: null,
          line1: 'adress line one',
          line2: null,
          pincode: '686691',
        } as unknown as Address,
        borrowedBooks: [
          {
            id: 'a',
          },
        ] as unknown as BorrowedBook,
      } as unknown as Employee

      const mockFunction = jest.fn()
      when(mockFunction).calledWith('a').mockResolvedValueOnce(mockEmployee)
      employeeRepository.findById = mockFunction
      const employee = await employeeService.getEmployeeById('a')
      expect(employee).toMatchObject(mockEmployee)
    })

    test('Failure Case', async () => {
      const mockEmployee: Employee = {
        id: 'a',
        createdAt: new Date('2023-08-04T03:13:09.449Z'),
        updatedAt: new Date('2023-08-04T03:13:09.449Z'),
        deletedAt: null,
        name: 'John Newman',
        email: 'john@mail.com',
        age: null,
        password:
          '$2b$10$V3PqZiOnyewT/Y6ai8Q9QeHv1A7TVe1pUQE0PQocDNKpSlBnrvAN.',
        role: Role.UI,
        address: {
          id: 'a',
          createdAt: new Date('2023-08-04T03:13:09.449Z'),
          updatedAt: new Date('2023-08-04T03:13:09.449Z'),
          deletedAt: null,
          line1: 'adress line one',
          line2: null,
          pincode: '686691',
        } as unknown as Address,
      } as unknown as Employee

      const mockFunction = jest.fn()
      when(mockFunction).calledWith('a').mockResolvedValueOnce(null)
      employeeRepository.findById = mockFunction
      const employee = async () => await employeeService.getEmployeeById('a')
      expect(employee).rejects.toThrowError(NotFoundException)
    })
  })

  describe('Test for getAllEmployees', () => {
    test('Success Case', async () => {
      const mockFunction = jest.fn()
      mockFunction.mockResolvedValueOnce([{ id: 'a', name: 'name' }])
      employeeRepository.findAll = mockFunction
      const employee = await employeeService.getAllEmployees(10, 1)
      expect(employee).toStrictEqual([{ id: 'a', name: 'name' }])
    })

    test('Empty Output case', async () => {
      const mockFunction = jest.fn()
      mockFunction.mockResolvedValueOnce([])
      employeeRepository.findAll = mockFunction
      const employees = await employeeService.getAllEmployees(10, 1)
      expect(employees).toStrictEqual([])
    })
  })

  describe('Test for addEmployee', () => {
    test('Success case', async () => {
      const mockAddFunction = jest.fn()
      mockAddFunction.mockResolvedValueOnce({ id: 'a', name: 'Name' })
      employeeRepository.add = mockAddFunction

      const employee = plainToInstance(EmployeeDto, {
        name: 'name',
        email: 'email',
        password: 'pass',
        joiningDate: '2001-02-20',
        address: {
          line1: 'line 1',
          line2: 'line 2',
          line3: 'line 3',
          city: 'city',
          state: 'state',
          pincode: 'pincode',
        },
        role: Role.ADMIN,
        departmentId: 1,
      }) as Employee
      const newEmployee = await employeeService.addEmployee(employee)
      expect(newEmployee).toStrictEqual({ id: 'a', name: 'Name' })
    })
  })

  describe('Tests for editEmployee', () => {
    test('Success case', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith('a').mockResolvedValue({
        id: 'a',
        name: 'Name',
      })
      employeeRepository.findById = mockFindById

      const mockUpdateEmployee = jest.fn()
      mockUpdateEmployee.mockResolvedValueOnce({ id: 'a', name: 'Name' })
      employeeRepository.update = mockUpdateEmployee

      const editEmployeeDto = plainToInstance(EditEmployeeDto, {
        name: 'new Name',
      })

      expect(
        async () => await employeeService.editEmployee('a', editEmployeeDto)
      ).not.toThrowError()
    })

    test('Failure case', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith('a').mockResolvedValue({
        id: 'a',
        name: 'Name',
      })
      employeeRepository.findById = mockFindById

      const mockUpdateEmployee = jest.fn()
      mockUpdateEmployee.mockResolvedValueOnce({ id: 'a' })
      employeeRepository.update = mockUpdateEmployee

      const editEmployeeDto = plainToInstance(EditEmployeeDto, {
        name1: 'new Name',
        name: 'New Name',
      })

      expect(
        async () => await employeeService.editEmployee('a', editEmployeeDto)
      ).rejects.toThrowError()
    })

    test('Not found case', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith('a').mockResolvedValue(null)
      employeeRepository.findById = mockFindById

      const mockUpdateEmployee = jest.fn()
      mockUpdateEmployee.mockResolvedValueOnce({})
      employeeRepository.update = mockUpdateEmployee

      const editEmployeeDto = plainToInstance(EditEmployeeDto, {
        name: 'new Name',
      })
      expect(
        async () => await employeeService.editEmployee('a', editEmployeeDto)
      ).rejects.toThrowError()
    })

    test('Not found case', async () => {
      const mockFindById = jest.fn()
      when(mockFindById).calledWith('a').mockResolvedValue({})
      employeeRepository.findById = mockFindById

      const mockUpdateEmployee = jest.fn()
      mockUpdateEmployee.mockResolvedValueOnce(null)
      employeeRepository.update = mockUpdateEmployee

      const editEmployeeDto = plainToInstance(EditEmployeeDto, {
        name: 'new Name',
      })
      expect(
        async () => await employeeService.editEmployee('a', editEmployeeDto)
      ).rejects.toThrowError()
    })
  })

  describe('Test for loginEmployee', () => {
    test('Success case', async () => {
      const body = {
        email: 'mail@mail.com',
        password: 'password',
      }
      const employee = {
        name: 'name',
        email: 'mail@mail.com',
        role: Role.ADMIN,
        password: await bcrypt.hash('password', 10),
      } as Employee

      const mockFunction = jest.fn()
      when(mockFunction).calledWith(body.email).mockResolvedValueOnce(employee)
      employeeRepository.findByEmail = mockFunction

      const mockFunction2 = jest.fn()
      mockFunction2.mockResolvedValueOnce(true)
      bcrypt.compare = mockFunction2

      const mockFunction3 = jest.fn()
      mockFunction3.mockResolvedValueOnce('salkfdjlksjdf')
      jsonwebtoken.sign = mockFunction3

      const token = await employeeService.loginEmployee(
        plainToInstance(LoginDto, body)
      )
      expect(token).toBeDefined()
    })

    test('Failure case', async () => {
      const body = {
        email: 'mail@mail.com',
        password: 'password',
      }
      const employee = {
        name: 'name',
        email: 'mail@mail.com',
        role: Role.ADMIN,
        password: await bcrypt.hash('password', 10),
      } as Employee

      const mockFunction = jest.fn()
      when(mockFunction).calledWith(body.email).mockResolvedValueOnce(null)
      employeeRepository.findByEmail = mockFunction

      const mockFunction2 = jest.fn()
      mockFunction2.mockResolvedValueOnce(false)
      bcrypt.compare = mockFunction2

      const mockFunction3 = jest.fn()
      mockFunction3.mockResolvedValueOnce('salkfdjlksjdf')
      jsonwebtoken.sign = mockFunction3

      const token = async () =>
        await employeeService.loginEmployee(plainToInstance(LoginDto, body))
      expect(token).rejects.toThrowError()
    })

    test('Failure case for invalid username', async () => {
      const body = {
        email: 'notamail',
        password: 'password',
      }
      const mockFunction = jest.fn()
      when(mockFunction).calledWith(body.email).mockResolvedValueOnce({})
      employeeRepository.findByEmail = mockFunction

      const mockFunction2 = jest.fn()
      mockFunction2.mockResolvedValueOnce(false)
      bcrypt.compare = mockFunction2

      const mockFunction3 = jest.fn()
      mockFunction3.mockResolvedValueOnce('salkfdjlksjdf')
      jsonwebtoken.sign = mockFunction3

      expect(
        async () =>
          await employeeService.loginEmployee(plainToInstance(LoginDto, body))
      ).rejects.toThrowError(HttpException)
    })

    test('Failure case for invalid password', async () => {
      const body = {
        emial: 'mail@mail.com',
        password: 'invalid',
      }

      const employee = {
        name: 'name',
        email: 'mail@mail.com',
        role: Role.ADMIN,
        password: await bcrypt.hash('password', 10),
      }

      const mockFunction = jest.fn()
      when(mockFunction).calledWith(body.emial).mockResolvedValueOnce(employee)
      employeeRepository.findByEmail = mockFunction

      const mockFunction2 = jest.fn()
      mockFunction2.mockResolvedValueOnce(true)
      bcrypt.compare = mockFunction2

      const mockFunction3 = jest.fn()
      mockFunction3.mockResolvedValueOnce('salkfdjlksjdf')
      jsonwebtoken.sign = mockFunction3

      expect(
        async () =>
          await employeeService.loginEmployee(plainToInstance(LoginDto, body))
      ).rejects.toThrowError(HttpException)
    })
  })

  describe('updateEmployee', () => {
    test('Success case', async () => {
      const mockEmployee: Employee = {
        id: 'a',
        createdAt: new Date('2023-08-04T03:13:09.449Z'),
        updatedAt: new Date('2023-08-04T03:13:09.449Z'),
        deletedAt: null,
        name: 'John Newman',
        email: 'john@mail.com',
        age: null,
        password:
          '$2b$10$V3PqZiOnyewT/Y6ai8Q9QeHv1A7TVe1pUQE0PQocDNKpSlBnrvAN.',
        role: Role.UI,
        address: {
          id: 'a',
          createdAt: new Date('2023-08-04T03:13:09.449Z'),
          updatedAt: new Date('2023-08-04T03:13:09.449Z'),
          deletedAt: null,
          line1: 'adress line one',
          line2: null,
          pincode: '686691',
        } as unknown as Address,
      } as unknown as Employee

      const mockFindById = jest.fn()
      when(mockFindById).calledWith('a').mockResolvedValueOnce(mockEmployee)
      employeeService.getEmployeeById = mockFindById

      const mockUpdateEmployee = jest.fn()
      mockUpdateEmployee.mockResolvedValueOnce({ id: 'a', username: 'name' })
      employeeRepository.update = mockUpdateEmployee

      const updateEmployeeDto = plainToInstance(EmployeeDto, mockEmployee)
      expect(
        async () =>
          await employeeService.updateEmployee(
            'a',
            updateEmployeeDto as Employee
          )
      ).not.toThrowError(HttpException)
    })

    test('Failure case', async () => {
      const mockEmployee: Employee = {
        id: 'a',
        createdAt: new Date('2023-08-04T03:13:09.449Z'),
        updatedAt: new Date('2023-08-04T03:13:09.449Z'),
        deletedAt: null,
        name: 'John Newman',
        email: 'john@mail.com',
        age: null,
        password: 'pass',
        role: Role.UI,
        address: {
          id: 'a',
          createdAt: new Date('2023-08-04T03:13:09.449Z'),
          updatedAt: new Date('2023-08-04T03:13:09.449Z'),
          deletedAt: null,
          line1: 'adress line one',
          line2: null,
          pincode: '686691',
        } as unknown as Address,
      } as unknown as Employee

      const mockFindById = jest.fn()
      when(mockFindById).calledWith('a').mockResolvedValueOnce(null)
      employeeService.getEmployeeById = mockFindById

      const mockUpdateEmployee = jest.fn()
      mockUpdateEmployee.mockResolvedValueOnce({
        id: 'a',
        createdAt: new Date('2023-08-04T03:13:09.449Z'),
        updatedAt: new Date('2023-08-04T03:13:09.449Z'),
        deletedAt: null,
        name: 'John Newman',
        email: 'john@mail.com',
        age: null,
        password:
          '$2b$10$V3PqZiOnyewT/Y6ai8Q9QeHv1A7TVe1pUQE0PQocDNKpSlBnrvAN.',
        role: Role.UI,
        address: {
          id: 'a',
          createdAt: new Date('2023-08-04T03:13:09.449Z'),
          updatedAt: new Date('2023-08-04T03:13:09.449Z'),
          deletedAt: null,
          line1: 'adress line one',
          line2: null,
          pincode: '686691',
        } as unknown as Address,
      } as unknown as Employee)
      employeeRepository.update = mockUpdateEmployee

      const updateEmployeeDto = plainToInstance(EmployeeDto, mockEmployee)
      expect(
        async () =>
          await employeeService.updateEmployee(
            'a',
            updateEmployeeDto as Employee
          )
      ).rejects.toThrowError()
    })
  })

  describe('Test for removeEmployee', () => {
    test('Success case', async () => {
      const mockGetEmployee = jest.fn()
      when(mockGetEmployee)
        .calledWith('a')
        .mockResolvedValueOnce({ id: 'a', username: 'name' })
      employeeRepository.findById = mockGetEmployee

      const mockRemove = jest.fn()
      mockRemove.mockResolvedValueOnce({ id: 'a', username: 'name' })
      employeeRepository.remove = mockRemove

      expect(
        async () => await employeeService.removeEmployeeById('a')
      ).not.toThrowError()
    })
  })
})
