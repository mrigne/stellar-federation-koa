import { HttpError } from 'routing-controllers';

export class WrongCredentialsError extends HttpError {
    public json: any;

    constructor(errorJson?, errorCode = 500) {
        super(errorCode);
        this.json = errorJson;
        Object.setPrototypeOf(this, WrongCredentialsError.prototype);
    }

    public toJSON(): any {
        return this.json;
    }
}
