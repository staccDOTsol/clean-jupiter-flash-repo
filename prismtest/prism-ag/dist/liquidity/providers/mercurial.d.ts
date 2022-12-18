/// <reference types="node" />
import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";
export declare function getMercurialCacheData(connection: Connection): Promise<{
    programAccounts: {
        publicKey: PublicKey;
        accountInfo: AccountInfo<Buffer>;
    }[];
    mintResponses: any;
} | {
    programAccounts?: undefined;
    mintResponses?: undefined;
}>;
export declare function getMercurialPools(data: any): any;
