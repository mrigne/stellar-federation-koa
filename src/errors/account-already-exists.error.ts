import { HttpError } from 'routing-controllers';

export class AccountAlreadyExistsError extends HttpError {
    public json: any;

    constructor(errorJson?, errorCode = 500) {
        super(errorCode);
        this.json = errorJson;
        Object.setPrototypeOf(this, AccountAlreadyExistsError.prototype);
    }

    public toJSON(): any {
        return this.json;
    }
}
