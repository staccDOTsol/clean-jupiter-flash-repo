/// <reference types="node" />
/// <reference types="@lifinity/sdk/node_modules/@solana/web3.js" />
/// <reference types="@lifinity/sdk/node_modules/@project-serum/anchor/node_modules/@solana/web3.js" />
import { Connection, PublicKey } from '@solana/web3.js';
export declare function getOpenbookCacheData(connection: Connection): Promise<{
    marketInfos: never[] | {
        publicKey: PublicKey;
        accountInfo: import("@solana/web3.js").AccountInfo<Buffer>;
    }[];
} | {
    marketInfos?: undefined;
}>;
export declare function getOpenbookMarkets(data: any): any;
