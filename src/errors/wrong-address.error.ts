import { HttpError } from 'routing-controllers';

export class WrongAddressError extends HttpError {
    public json: any;

    constructor(errorJson?, errorCode = 500) {
        super(errorCode);
        this.json = errorJson;
        Object.setPrototypeOf(this, WrongAddressError.prototype);
    }

    public toJSON(): any {
        return this.json;
    }
}
