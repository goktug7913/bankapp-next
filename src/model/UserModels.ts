/**
* @desc TODO: Migrate to Prisma Models
**/
export interface UserAccountInterface {
    account_id: string;
    password?: string;
    name: string;
    surname: string;
    email: string;
    fiat_accounts: Array<IFiatAccount>;
    crypto_accounts: Array<ICryptoAccount>;
    transactions: Array<ITransaction>;
    token: string;
}

export interface IFiatAccount {
    id: string;
    account_id: string;
    name: string;
    currency: string;
    balance: number;
    transactions: Array<ITransaction>;
}

export interface ICryptoAccount {
    _id: string;
    account_id: string;
    name: string;
    currency: string;
    balance: number;
    transactions: Array<ITransaction>;
}

export interface ITransaction {
    id: string;
    type: string;
    amount: number;
    currency: string;
    date: Date;
    description: string;
    source_account?: string;
    destination_account?: string;
}