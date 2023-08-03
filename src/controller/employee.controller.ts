import { Router, Request, Response } from 'express'
import EmployeeService from '../service/employee.service'

class EmployeeController {
    public router: Router
    private employeeService: EmployeeService

    constructor() {
        this.router = Router()
        this.employeeService = new EmployeeService()

        this.router.get('/', this.getAllEmployees)
        this.router.get('/:id', this.getEmployeeById)
    }

    getAllEmployees = async (req: Request, res: Response) => {
        const employees = await this.employeeService.getAllEmployees()
        res.status(200).send(employees)
    }

    getEmployeeById = async (req: Request, res: Response) => {
        const employeeId = Number(req.params.id)
        const employee = await this.employeeService.getEmployeeById(employeeId)
        res.status(200).send(employee)
    }
}

export default EmployeeController