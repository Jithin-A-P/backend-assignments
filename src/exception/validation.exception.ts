import { ValidationError } from 'class-validator'
import HttpException from './http.exception'

// Changes 
// Throw 400 and a constant validation exception always
class ValidationException extends HttpException {
    public errorPayload = {}
    constructor(status: number, public message: string, private validationErrors: ValidationError[]) {
        super(status, message)
        this.errorPayload['message'] = this.message
        this.errorPayload['errors'] = this.generateErrors(validationErrors)
    }

    private getErrorConstraints = (validationError: ValidationError) => {
        if(validationError.constraints)
            return Object.values(validationError.constraints)
    }

    private generateErrors = (errors: ValidationError[]) => {
        const errorsObject = {}
        errors.forEach((error) => {
            if(error.children.length > 0)
                errorsObject[error.property] = this.generateErrors(error.children)
            else
                errorsObject[error.property] = this.getErrorConstraints(error)
        })
        return errorsObject
    }

}

export default ValidationException 