import { Service } from 'typedi';
import * as path from 'path';
import { IAccount } from '../interfaces/account.interface';
import * as fs from 'fs'
import { IColumnsSearchParam } from '../interfaces/columns-search-param';
import { AccountAlreadyExistsError } from '../errors/account-already-exists.error';
import { AccountNotFoundError } from '../errors/account-not-found.error';
import { ConfigHelperService } from './config-helper.service';

@Service()
export class DatabaseHelperService {
    private readonly dbFile;

    constructor(private configHelper: ConfigHelperService) {
        this.dbFile = path.resolve(this.configHelper.getConfig().database_file);
    }

    public getAllAccounts(): IAccount[] {
        return JSON.parse(fs.readFileSync(this.dbFile).toString());
    }

    public getAccountsByColumns(params: IColumnsSearchParam[] | IColumnsSearchParam): IAccount[] {
        const parameters = Array.isArray(params) ? params : [params];
        return this.getAllAccounts().filter(account => {
            let isMatching = true;
            parameters.every(parameter => {
                if (account[parameter.column] !== parameter.value) {
                    isMatching = false;
                    return false;
                }
                return true;
            });
            return isMatching;
        });
    }

    public insertAccount(account: IAccount, rewrite_account = false): void {
        const accounts = this.getAllAccounts();
        const isAccountExist = accounts.some(acc => acc.federation === account.federation);
        if (isAccountExist && !rewrite_account) {
            throw new AccountAlreadyExistsError({
                error: {
                    type: 'AccountAlreadyExistsError'
                }
            });
        }
        accounts.push(account);
        this.saveAccountsToFile(accounts);
    }

    public updateAccount(account: IAccount): void {
        const accounts = this.getAllAccounts();
        const isAccountExist = accounts.some(acc => acc.federation === account.federation);
        if (!isAccountExist) {
            throw new AccountNotFoundError({
                error: {
                    type: 'AccountNotFoundError'
                }
            }, 500);
        }
        this.insertAccount(account, true);
    }

    public deleteAccount(federation: string): void {
        const accounts = this.getAllAccounts();
        const isAccountExist = accounts.some(acc => acc.federation === federation);
        if (!isAccountExist) {
            throw new AccountNotFoundError();
        }
        this.saveAccountsToFile(accounts.filter(account => account.federation !== federation));
    }

    private saveAccountsToFile(accounts: IAccount[]): void {
        fs.writeFileSync(this.dbFile, JSON.stringify(accounts, null, 4));
    }
}
