import { HttpError } from 'routing-controllers';

export class AccountNotFoundError extends HttpError {
    public json: any;

    constructor(errorJson?, errorCode = 404) {
        super(errorCode);
        this.json = errorJson;
        Object.setPrototypeOf(this, AccountNotFoundError.prototype);
    }

    public toJSON(): any {
        return this.json;
    }
}
