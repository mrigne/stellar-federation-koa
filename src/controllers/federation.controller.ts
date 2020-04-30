import {
    Get,
    Post,
    Put,
    Delete,
    JsonController,
    QueryParam,
    Authorized,
    BodyParam
} from 'routing-controllers';
import { DatabaseHelperService } from '../services/database-helper.service';
import { IColumnsSearchParam } from '../interfaces/columns-search-param';
import { ConfigHelperService } from '../services/config-helper.service';
import { AccountNotFoundError } from '../errors/account-not-found.error';
import { IAccount } from '../interfaces/account.interface';
import * as fs from 'fs';
import * as path from 'path';

@JsonController()
export class FederationController {

    constructor(private dbHelper: DatabaseHelperService,
                private configHelper: ConfigHelperService) {}

    @Get('/accounts/list')
    public getAllAccounts() {
        return this.dbHelper.getAllAccounts().map(accountEntry => {
            accountEntry.federation;
            return accountEntry;
        });
    }

    @Get('/.well-known/stellar.toml')
    public getStellarToml(): any {
        return fs.readFileSync(path.resolve(this.configHelper.getConfig().stellar_toml_file)).toString();
    }

    @Get('/federation')
    public getFederationRecord(@QueryParam('type') type: string, @QueryParam('q') federationAddress: string) {
        const searchParam: IColumnsSearchParam = {
                column: 'federation',
                value: federationAddress.replace(`*${this.configHelper.getConfig().host}`, '')
            };
        const foundAccounts = this.dbHelper.getAccountsByColumns(searchParam);

        if (foundAccounts.length === 0) {
            throw new AccountNotFoundError();
        } else {
            const foundAccount = foundAccounts[0];
            foundAccount.federation += `*${this.configHelper.getConfig().host}`;
            return foundAccounts[0];
        }
    }

    @Authorized()
    @Put('/accounts/create')
    public createNewAccount(
        @BodyParam('federation') federation: string,
        @BodyParam('address') address:string,
        @BodyParam('memo_type') memo_type: string = 'none',
        @BodyParam('memo') memo?: string
    ): any {
        const newAccount: IAccount = {
            federation,
            address,
            memo_type
        };

        if (typeof memo !== 'undefined') {
            newAccount.memo = memo;
        }

        this.dbHelper.insertAccount(newAccount);
        return '';
    }

    @Authorized()
    @Post('/accounts/update')
    public  updateAccount(
        @BodyParam('federation') federation: string,
        @BodyParam('address') address:string,
        @BodyParam('memo_type') memo_type: string = 'none',
        @BodyParam('memo') memo?: string
    ): any {
        const newAccount: IAccount = {
            federation,
            address,
            memo_type
        };

        if (typeof memo !== 'undefined') {
            newAccount.memo = memo;
        }

        this.dbHelper.updateAccount(newAccount);
    }

    @Authorized()
    @Post('/accounts/delete')
    public deleteAccount(@BodyParam('federation') federation: string): any {
        this.dbHelper.deleteAccount(federation);
        return '';
    }
}
