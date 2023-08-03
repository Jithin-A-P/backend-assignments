import e, { Router, Request, Response } from 'express'
import EmployeeService from '../service/employee.service'

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

    addEmployee = async (req: Request, res: Response) => {
        const name = req.body.name
        const email = req.body.email
        const addedEmployee = await this.employeeService.addEmployee(name, email)
        res.status(201).send(addedEmployee)
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

    updateEmployeeById = async (req: Request, res: Response) => {
        const employeeId = Number(req.params.id)
        const name = req.body.name
        const email = req.body.email
        const updatedEmployee = await this.employeeService.updateEmployeeById(employeeId, name, email)
        res.status(200).send(updatedEmployee)
    }

    removeEmployeeById = async (req: Request, res: Response) => {
        const employeeId = Number(req.params.id)
        await this.employeeService.removeEmployeeById(employeeId)
        res.status(204).end()
    }
}

export default EmployeeController