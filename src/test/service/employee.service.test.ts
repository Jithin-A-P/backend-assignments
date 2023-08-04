import { DataSource } from 'typeorm'
import { when } from 'jest-when'
import EmployeeRepository from '../../repository/employee.repository'
import Employee from '../../entity/employee.entity'
import EmployeeService from '../../service/employee.service'
import { Role } from '../../utils/role.enum'
import Address from '../../entity/address.entity'

describe('Employee Service Tests', () => {
    let employeeRepository: EmployeeRepository
    let employeeService: EmployeeService
    beforeAll(() => {
        const dataSource: DataSource = {
            getRepository: jest.fn()
        } as unknown as DataSource
        employeeRepository = new EmployeeRepository(dataSource.getRepository(Employee))
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
                password: '$2b$10$V3PqZiOnyewT/Y6ai8Q9QeHv1A7TVe1pUQE0PQocDNKpSlBnrvAN.',
                role: Role.UI,
                address: {
                    id: 19,
                    createdAt: new Date('2023-08-04T03:13:09.449Z'),
                    updatedAt: new Date('2023-08-04T03:13:09.449Z'),
                    deletedAt: null,
                    line1: 'adress line one',
                    line2: null,
                    pincode: '686691'
                } as unknown as Address
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

    describe('Test for getALlEmployees', () => {
        test('Test for users', async () => {
            const spy = jest.spyOn(employeeRepository, 'findAll')
            expect(spy).toBeCalledTimes(1)
        })
    })
})