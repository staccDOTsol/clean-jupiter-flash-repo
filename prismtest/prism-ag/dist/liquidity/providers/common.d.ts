/// <reference types="node" />
import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";
export declare function getFilteredProgramAccounts(connection: Connection, programId: PublicKey, filters: any): Promise<{
    publicKey: PublicKey;
    accountInfo: AccountInfo<Buffer>;
}[]>;
export declare function getFilteredProgramAccountsAmmOrMarketCache(cacheName: String, connection: Connection, programId: PublicKey, filters: any): Promise<{
    publicKey: PublicKey;
    accountInfo: AccountInfo<Buffer>;
}[]>;
