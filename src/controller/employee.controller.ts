import { Router, Request, Response, NextFunction } from 'express'
import EmployeeService from '../service/employee.service'
import { plainToInstance } from 'class-transformer'
import CreateEmployeeDto from '../dto/create-employee.dto'
import { validate } from 'class-validator'
import ValidationException from '../exception/validation.exception'

class EmployeeController {
    public router: Router

    constructor(private employeeService: EmployeeService) {
        this.router = Router()

        this.router.post('/', this.addEmployee)
        this.router.get('/', this.getAllEmployees)
        this.router.get('/:id', this.getEmployeeById)
        this.router.put('/:id', this.updateEmployeeById)
        this.router.delete('/:id', this.removeEmployeeById)
    }

    addEmployee = async (req: Request, res: Response, next: NextFunction) => {
        try {       
            const {name, email, address} = req.body
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body)
            const errors = await validate(createEmployeeDto)
            if(errors.length > 0) {
                throw new ValidationException(400, 'Validation Error', errors)
            }
            const addedEmployee = await this.employeeService.addEmployee(name, email, address)
            res.status(201).send(addedEmployee)
        } catch(error) {
            next(error)
        }
    }

    getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employees = await this.employeeService.getAllEmployees()
            res.status(200).send(employees)
        } catch(error) {
            next(error)
        }
    }

    getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id)
            const employee = await this.employeeService.getEmployeeById(employeeId)
            res.status(200).send(employee)
        } catch(error) {
            next(error)
        }
    }

    updateEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id)
            const { name, email, address } = req.body
            const createEmployeeDto = plainToInstance(CreateEmployeeDto, req.body)
            const errors = await validate(createEmployeeDto)
            if(errors.length > 0) {
                throw new ValidationException(400, 'Validation Error', errors)
            }
            const updatedEmployee = await this.employeeService.updateEmployeeById(employeeId, name, email, address)
            res.status(200).send(updatedEmployee)
        } catch(error) {
            next(error)
        }
    }

    removeEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = Number(req.params.id)
            await this.employeeService.removeEmployeeById(employeeId)
            res.status(204).end()
        } catch(error) {
            next(error)
        }
    }
}


export default EmployeeController