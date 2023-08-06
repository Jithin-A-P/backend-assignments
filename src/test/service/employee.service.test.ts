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
import bcrypt from 'bcrypt'
import HttpException from '../../exception/http.exception'
import LoginDto from '../../dto/login.dto'

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
    test('Test employee for id 1', async () => {
      const mockEmployee: Employee = {
        id: 20,
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
          id: 19,
          createdAt: new Date('2023-08-04T03:13:09.449Z'),
          updatedAt: new Date('2023-08-04T03:13:09.449Z'),
          deletedAt: null,
          line1: 'adress line one',
          line2: null,
          pincode: '686691',
        } as unknown as Address,
      } as unknown as Employee

      const mockFunction = jest.fn()
      when(mockFunction).calledWith(1).mockResolvedValueOnce(mockEmployee)
      employeeRepository.findById = mockFunction
      const employee = await employeeService.getEmployeeById(1)
      expect(employee).toMatchObject(mockEmployee)
    })
    test('Test employee for id 1', async () => {
      const mockFunction = jest.fn()
      when(mockFunction).calledWith(1).mockResolvedValueOnce(null)
      employeeRepository.findById = mockFunction
      const employee = async () => await employeeService.getEmployeeById(1)
      expect(employee).rejects.toThrowError()
    })
  })

  describe('Test for getAllEmployees', () => {
    test('Success Case', async () => {
      const mockFunction = jest.fn()
      mockFunction.mockResolvedValueOnce([{ id: 1, name: 'name' }])
      employeeRepository.findAll = mockFunction
      const employee = await employeeService.getAllEmployees()
      expect(employee).toStrictEqual([{ id: 1, name: 'name' }])
    })

    test('Empty Output case', async () => {
      const mockFunction = jest.fn()
      mockFunction.mockResolvedValueOnce([])
      employeeRepository.findAll = mockFunction
      const employees = await employeeService.getAllEmployees()
      expect(employees).toStrictEqual([])
    })
  })

  describe('Test for createEmployee', () => {
    test('Success case', async () => {
      const mockAddFunction = jest.fn()
      mockAddFunction.mockResolvedValueOnce({ id: 1 })
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
      expect(newEmployee).toStrictEqual({ id: 1 })
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

      const token = await employeeService.loginEmployee(
        plainToInstance(LoginDto, body)
      )
      expect(token).toBeDefined()
    })

    test('Failure case for invalid username', async () => {
      const body = {
        email: 'notamail',
        password: 'password',
      }
      const mockFunction = jest.fn()
      when(mockFunction).calledWith(body.email).mockResolvedValueOnce(null)
      employeeRepository.findByEmail = mockFunction
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

      expect(
        async () =>
          await employeeService.loginEmployee(plainToInstance(LoginDto, body))
      ).rejects.toThrowError(HttpException)
    })
  })

  describe('updateEmployee', () => {
    test('Success case', async () => {
      const mockEmployee: Employee = {
        id: 1,
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
          id: 19,
          createdAt: new Date('2023-08-04T03:13:09.449Z'),
          updatedAt: new Date('2023-08-04T03:13:09.449Z'),
          deletedAt: null,
          line1: 'adress line one',
          line2: null,
          pincode: '686691',
        } as unknown as Address,
      } as unknown as Employee

      const mockFindById = jest.fn()
      when(mockFindById).calledWith(1).mockResolvedValueOnce(mockEmployee)
      employeeRepository.findById = mockFindById

      const mockUpdateEmployee = jest.fn()
      mockUpdateEmployee.mockResolvedValueOnce({ id: 1, username: 'name' })
      employeeRepository.update = mockUpdateEmployee

      const updateEmployeeDto = plainToInstance(EmployeeDto, mockEmployee)
      expect(
        async () =>
          await employeeService.updateEmployee(updateEmployeeDto as Employee)
      ).not.toThrowError(HttpException)
    })
  })

  describe('Test for removeEmployee', () => {
    test('Success case', async () => {
      const mockGetEmployee = jest.fn()
      when(mockGetEmployee).calledWith(1).mockResolvedValueOnce(new Employee())
      employeeService.getEmployeeById = mockGetEmployee

      const mockRemove = jest.fn()
      mockRemove.mockImplementation((employee) => {})
      employeeRepository.remove = mockRemove

      expect(employeeService.removeEmployeeById(1)).resolves.not.toThrowError()
    })
  })
})
