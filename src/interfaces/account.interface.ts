import {MemoType} from "../enums/memo-type.enum";

export interface IAccount {
    federation: string;
    address: string;
    memoType?: MemoType;
    memo?: string;
}
