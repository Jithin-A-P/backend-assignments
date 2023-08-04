import { Router, Request, Response, NextFunction } from 'express'
import EmployeeService from '../service/employee.service'
import { plainToInstance } from 'class-transformer'
import EmployeeDto from '../dto/employee.dto'
import { validate } from 'class-validator'
import ValidationException from '../exception/validation.exception'
import autheticate from '../middleware/authenticate.middleware'

class EmployeeController {
    public router: Router

    constructor(private employeeService: EmployeeService) {
        this.router = Router()
        this.router.post('/', this.addEmployee)
        this.router.get('/', autheticate, this.getAllEmployees)
        this.router.get('/:id', this.getEmployeeById)
        this.router.put('/:id', this.updateEmployeeById)
        this.router.delete('/:id', this.removeEmployeeById)
        this.router.post('/login', this.loginEmployee)
    }

    addEmployee = async (req: Request, res: Response, next: NextFunction) => {
        try {       
            const {name, email, address, password} = req.body // TODO: use validted DTO object to get values
            const employeeDto = plainToInstance(EmployeeDto, req.body)
            const errors = await validate(employeeDto)
            if(errors.length > 0) {
                throw new ValidationException(400, 'Validation Error', errors)
            }
            const addedEmployee = await this.employeeService.addEmployee(name, email, address, password)
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
            const employeeDto = plainToInstance(EmployeeDto, req.body)
            const errors = await validate(employeeDto)
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

    loginEmployee = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body
        try {
            const token = await this.employeeService.loginEmployee(email, password)
            res.status(200).send({ data: token })
        } catch(error) {
            next(error)
        }
    }
}


export default EmployeeController