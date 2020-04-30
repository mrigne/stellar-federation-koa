import { IAccount } from '../interfaces/account.interface';
import { WrongAddressError } from '../errors/wrong-address.error';

export class StellarChecksHelper {
    public static checkStellarAddress(address: string): boolean {
        const regex = /^[G][A-Z0-9]{55,55}$/;
        return regex.test(address);
    }

    public static checkFederationAddress(federation: string): boolean {
        const regex = /^[a-zA-Z0-9_\-\.~@#$%^&=\+]+$/;
        return regex.test(federation);
    }

    public static checkAccount(account: IAccount): void {
        if (!StellarChecksHelper.checkFederationAddress(account.federation)) {
            throw new WrongAddressError({
                error: {
                    type: 'WrongAddressError',
                    params: {
                        field: 'federation'
                    }
                }
            })
        }
        if (!StellarChecksHelper.checkStellarAddress(account.address)) {
            throw new WrongAddressError({
                error: {
                    type: 'WrongAddressError',
                    params: {
                        field: 'address'
                    }
                }
            })
        }
    }
}
