import { MemoType } from '../enums/memo-type.enum';

export interface IFederationResponse {
    stellar_address: string;
    account_id: string;
    memo_type?: MemoType;
    memo?: string | number;
}
