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
import { StellarChecksHelper } from '../utils/stellar-checks.helper';
import { IFederationResponse } from '../interfaces/federation-response.interface';

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
            return this.formFederationAccountResponse(foundAccounts[0]);
        }
    }

    @Authorized()
    @Put('/accounts/create')
    public createNewAccount(
        @BodyParam('federation') federation: string,
        @BodyParam('address') address: string,
        @BodyParam('memo_type') memo_type: string = 'none',
        @BodyParam('memo') memo?: string
    ): any {
        const newAccount: IAccount = {
            federation,
            address,
            memo_type
        };

        StellarChecksHelper.checkAccount(newAccount);

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

        StellarChecksHelper.checkAccount(newAccount);

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

    private formFederationAccountResponse(dbAccount: IAccount): IFederationResponse {
        const federationResponse: IFederationResponse = {
            stellar_address: `${dbAccount.federation}*${this.configHelper.getConfig().host}`,
            account_id: dbAccount.address,
            memo_type: dbAccount.memo_type || 'none'
        };
        if (dbAccount.hasOwnProperty('memo')) {
            federationResponse.memo = dbAccount.memo
        }
        return federationResponse;
    }
}
