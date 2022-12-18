import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { Wallet } from "../types/types";
export declare function createSyncNativeInstruction(nativeAccount: PublicKey): TransactionInstruction;
export declare function createProgramAccountIfNotExist(connection: Connection, account: string | undefined | null, owner: PublicKey, programId: PublicKey, lamports: number | null, layout: any, transaction: Transaction, signer: Array<Account>): Promise<PublicKey>;
export declare function createTokenAccountIfNotExist(connection: Connection, account: string | undefined | null, owner: PublicKey, mintAddress: string, lamports: number | null, transaction: Transaction, signer: Array<Account>): Promise<PublicKey>;
export declare function createAssociatedTokenAccountIfNotExist(account: string | undefined | null, owner: PublicKey, mintAddress: string, connection: Connection, transaction: Transaction, atas?: string[]): Promise<PublicKey>;
export declare function getTokenAccountAddressByMint(accounts: any, coin: any): any;
export declare function prepareAccounts(user: PublicKey, userAccounts: Array<any>, connection: Connection, route: any, preTransaction: Transaction, preSigners: Array<any>, postTransaction: Transaction): Promise<{
    fromTokenAccount: any;
    midTokenAccount: any;
    toTokenAccount: any;
}>;
export declare function generateFeesAccount(connection: Connection, settings: any, user: PublicKey, mint: string, preTransaction: Transaction, route: any): Promise<{
    owner: PublicKey;
    host: PublicKey;
} | null>;
export declare function applyBlockHashAndPartialSign(connection: Connection, wallet: Wallet, preTransaction: Transaction, transaction: Transaction, postTransaction: Transaction, preSigners: Array<any>, signers: Array<any>): Promise<{
    txIndex: number;
    transactions: any;
}>;
export declare function parseMeta(response: any, txId: any, swapResult: any): Promise<{
    status: string;
    error: any;
    from?: undefined;
    to?: undefined;
    fromAmount?: undefined;
    fromMint?: undefined;
    toAmount?: undefined;
    toMint?: undefined;
    rateA?: undefined;
    rateB?: undefined;
    txId?: undefined;
} | {
    status: string;
    from: any;
    to: any;
    fromAmount: number;
    fromMint: any;
    toAmount: number;
    toMint: any;
    rateA: number;
    rateB: number;
    txId: any;
    error?: undefined;
}>;
